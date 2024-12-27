import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";

export const useManufacturingData = () => {
  return useQuery({
    queryKey: ['manufacturingData'],
    queryFn: async () => {
      console.log('Fetching manufacturing data');
      
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
          created_at,
          updated_at,
          patients (
            first_name,
            last_name
          ),
          report_cards (
            design_info:design_info_id(*),
            clinical_info:clinical_info_id(*),
            design_info_status,
            clinical_info_status
          )
        `);

      if (error) {
        console.error("Error fetching manufacturing data:", error);
        throw error;
      }

      console.log("Fetched scripts:", scripts);

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

      // Filter scripts that have completed design info
      const manufacturingQueue = mappedScripts.filter(s => 
        s.designInfoStatus === 'completed' && 
        s.status !== 'completed'
      );

      console.log("Manufacturing queue:", manufacturingQueue);

      const inhousePrinting = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Printing'
      );

      const inhouseMilling = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Milling'
      );

      const outsourcePrinting = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Printing'
      );

      const outsourceMilling = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Milling'
      );

      const completedOutsourceMilling = mappedScripts.filter(s => 
        s.manufacturingSource === 'Outsource' && 
        s.manufacturingType === 'Milling' && 
        s.status === 'completed'
      );

      return {
        counts: {
          inhousePrinting: inhousePrinting.length,
          inhouseMilling: inhouseMilling.length,
          outsourcePrinting: outsourcePrinting.length,
          outsourceMilling: outsourceMilling.length,
          completedOutsourceMilling: completedOutsourceMilling.length,
          total: manufacturingQueue.length
        },
        scripts: manufacturingQueue
      };
    },
    refetchInterval: 1, // Updated to 1ms for real-time updates
    refetchIntervalInBackground: true
  });
};