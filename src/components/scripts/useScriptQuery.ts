import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { useEffect } from "react";

interface DatabaseLabScript {
  id: string;
  request_number: string;
  patient_id: string;
  doctor_name: string;
  clinic_name: string;
  request_date: string;
  due_date: string;
  status: string;
  upper_treatment: string;
  lower_treatment: string;
  upper_design_name: string;
  lower_design_name: string;
  appliance_type: string;
  screw_type: string;
  vdo_option: string;
  specific_instructions: string;
  created_at: string;
  patient: {
    first_name: string;
    last_name: string;
  };
}

const mapDatabaseToLabScript = (dbScript: DatabaseLabScript): LabScript => {
  return {
    id: dbScript.id,
    patientId: dbScript.patient_id,
    patientFirstName: dbScript.patient?.first_name,
    patientLastName: dbScript.patient?.last_name,
    doctorName: dbScript.doctor_name,
    clinicName: dbScript.clinic_name,
    requestDate: dbScript.request_date,
    dueDate: dbScript.due_date,
    status: dbScript.status as LabScript['status'],
    upperTreatment: dbScript.upper_treatment,
    lowerTreatment: dbScript.lower_treatment,
    upperDesignName: dbScript.upper_design_name,
    lowerDesignName: dbScript.lower_design_name,
    applianceType: dbScript.appliance_type,
    screwType: dbScript.screw_type,
    vdoOption: dbScript.vdo_option,
    specificInstructions: dbScript.specific_instructions,
  };
};

export const useScriptQuery = (statusFilter: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up real-time subscription for lab scripts");
    const channel = supabase
      .channel('lab-scripts-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'lab_scripts'
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ['labScripts', statusFilter] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [statusFilter, queryClient]);

  return useQuery({
    queryKey: ['labScripts', statusFilter],
    queryFn: async () => {
      console.log("Fetching lab scripts with filter:", statusFilter);
      try {
        let query = supabase
          .from('lab_scripts')
          .select(`
            *,
            patient:patients(first_name, last_name)
          `);

        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }

        const { data: scripts, error } = await query
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase error fetching lab scripts:", error);
          toast({
            title: "Error fetching scripts",
            description: "Please check your connection and try again",
            variant: "destructive"
          });
          throw error;
        }

        console.log("Successfully fetched scripts:", scripts?.length || 0);
        return (scripts || []).map(script => mapDatabaseToLabScript(script as DatabaseLabScript));
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    refetchInterval: 1, // Refetch every millisecond for real-time updates
    retry: 3,
    retryDelay: 1000,
  });
};