import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";

export const useManufacturingData = () => {
  return useQuery({
    queryKey: ['manufacturingData'],
    queryFn: async () => {
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
          )
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
          clinicalInfoStatus: script.report_cards?.[0]?.clinical_info_status || 'pending'
        };
      });

      // Filter scripts that have manufacturing source and type
      const manufacturingQueue = mappedScripts.filter(s => 
        s.manufacturingSource && s.manufacturingType
      );

      // Calculate counts for each category
      const inhousePrinting = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Printing'
      ).length;

      const inhouseMilling = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Milling'
      ).length;

      const outsourcePrinting = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Printing'
      ).length;

      const outsourceMilling = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Milling'
      ).length;

      return {
        counts: {
          inhousePrinting,
          inhouseMilling,
          outsourcePrinting,
          outsourceMilling,
          total: manufacturingQueue.length
        },
        scripts: manufacturingQueue
      };
    },
    refetchInterval: 3000, // Changed from 1 to 3000ms (3 seconds)
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 0
  });
};