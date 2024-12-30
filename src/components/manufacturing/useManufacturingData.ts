import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";
import { useEffect } from "react";

export const useManufacturingData = () => {
  const queryClient = useQueryClient();

  // Function to fetch and map manufacturing data
  const fetchManufacturingData = async () => {
    console.log("Fetching manufacturing data with completed design info");
    const { data: scripts, error } = await supabase
      .from('lab_scripts')
      .select(`
        id,
        request_number,
        doctor_name,
        clinic_name,
        request_date,
        due_date,
        status,
        manufacturing_source,
        manufacturing_type,
        material,
        shade,
        appliance_type,
        upper_design_name,
        lower_design_name,
        created_at,
        updated_at,
        patients (
          first_name,
          last_name
        ),
        report_cards!inner (
          design_info:design_info_id(*),
          clinical_info:clinical_info_id(*),
          design_info_status,
          clinical_info_status
        ),
        manufacturing_logs (*)
      `)
      .eq('report_cards.design_info_status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching manufacturing data:", error);
      throw error;
    }

    console.log("Retrieved scripts with completed design info:", scripts);

    const mappedScripts = scripts.map(script => {
      const mappedScript = mapDatabaseLabScript(script);
      return {
        ...mappedScript,
        patientFirstName: script.patients?.first_name,
        patientLastName: script.patients?.last_name,
        designInfo: script.report_cards?.[0]?.design_info,
        clinicalInfo: script.report_cards?.[0]?.clinical_info,
        designInfoStatus: script.report_cards?.[0]?.design_info_status || 'pending',
        clinicalInfoStatus: script.report_cards?.[0]?.clinical_info_status || 'pending',
        manufacturingLog: script.manufacturing_logs?.[0]
      };
    });

    const manufacturingQueue = mappedScripts.filter(s => 
      s.manufacturingSource && s.manufacturingType
    );

    return {
      counts: {
        inhousePrinting: manufacturingQueue.filter(s => 
          s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Printing'
        ).length,
        inhouseMilling: manufacturingQueue.filter(s => 
          s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Milling'
        ).length,
        outsourcePrinting: manufacturingQueue.filter(s => 
          s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Printing'
        ).length,
        outsourceMilling: manufacturingQueue.filter(s => 
          s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Milling'
        ).length,
        total: manufacturingQueue.length
      },
      scripts: manufacturingQueue
    };
  };

  // Set up real-time subscription for manufacturing logs
  useEffect(() => {
    console.log("Setting up real-time subscription for manufacturing logs");
    const channel = supabase
      .channel('manufacturing-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturing_logs'
        },
        async (payload) => {
          console.log("Received real-time update for manufacturing log:", payload);
          
          // Immediately refetch the data and update the cache
          const newData = await fetchManufacturingData();
          queryClient.setQueryData(['manufacturingData'], newData);
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up manufacturing logs subscription");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Use React Query with real-time updates
  return useQuery({
    queryKey: ['manufacturingData'],
    queryFn: fetchManufacturingData,
    refetchInterval: 1000, // Refetch every second as a fallback
    staleTime: 0, // Consider data always stale to enable refetching
    gcTime: 0 // Don't garbage collect the data
  });
};