import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";
import { useEffect } from "react";

export const useLabScripts = (statusFilter: string | null) => {
  const queryClient = useQueryClient();

  const { data: labScripts = [] } = useQuery({
    queryKey: ['labScripts', statusFilter],
    queryFn: async () => {
      console.log("Fetching lab scripts with filter:", statusFilter);
      let query = supabase
        .from('lab_scripts')
        .select(`
          *,
          patient:patients(first_name, last_name)
        `);

      if (statusFilter === 'incomplete') {
        query = query.neq('status', 'completed');
      } else if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data: scripts, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching lab scripts:", error);
        throw error;
      }

      console.log("Raw database response:", scripts);

      return scripts.map(script => ({
        id: script.id,
        requestNumber: script.request_number,
        patientId: script.patient_id,
        patientFirstName: script.patient?.first_name,
        patientLastName: script.patient?.last_name,
        doctorName: script.doctor_name,
        clinicName: script.clinic_name,
        requestDate: script.request_date,
        dueDate: script.due_date,
        status: script.status as LabScript["status"],
        upperTreatment: script.upper_treatment,
        lowerTreatment: script.lower_treatment,
        upperDesignName: script.upper_design_name,
        lowerDesignName: script.lower_design_name,
        applianceType: script.appliance_type,
        screwType: script.screw_type,
        vdoOption: script.vdo_option,
        specificInstructions: script.specific_instructions,
      } as LabScript));
    },
    refetchInterval: 1000
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('lab-scripts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_scripts'
        },
        (payload) => {
          console.log("Lab script change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ['labScripts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { labScripts };
};