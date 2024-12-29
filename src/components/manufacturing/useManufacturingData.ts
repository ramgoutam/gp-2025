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
          manufacturing_logs (
            manufacturing_status,
            manufacturing_started_at,
            manufacturing_completed_at,
            manufacturing_hold_at,
            manufacturing_hold_reason,
            sintering_status,
            sintering_started_at,
            sintering_completed_at,
            sintering_hold_at,
            sintering_hold_reason,
            miyo_status,
            miyo_started_at,
            miyo_completed_at,
            miyo_hold_at,
            miyo_hold_reason,
            inspection_status,
            inspection_started_at,
            inspection_completed_at,
            inspection_hold_at,
            inspection_hold_reason
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
        // Get the latest manufacturing log
        const manufacturingLog = script.manufacturing_logs?.[0];
        
        return {
          ...mappedScript,
          patientFirstName: script.patients?.first_name,
          patientLastName: script.patients?.last_name,
          designInfo: script.report_cards?.[0]?.design_info,
          clinicalInfo: script.report_cards?.[0]?.clinical_info,
          designInfoStatus: script.report_cards?.[0]?.design_info_status || 'pending',
          clinicalInfoStatus: script.report_cards?.[0]?.clinical_info_status || 'pending',
          manufacturingStatus: manufacturingLog?.manufacturing_status || 'pending',
          sinteringStatus: manufacturingLog?.sintering_status || 'pending',
          miyoStatus: manufacturingLog?.miyo_status || 'pending',
          inspectionStatus: manufacturingLog?.inspection_status || 'pending'
        };
      });

      // Filter scripts that have manufacturing source and type
      const manufacturingQueue = mappedScripts.filter(s => 
        s.manufacturingSource && s.manufacturingType
      );

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

      return {
        counts: {
          inhousePrinting: inhousePrinting.length,
          inhouseMilling: inhouseMilling.length,
          outsourcePrinting: outsourcePrinting.length,
          outsourceMilling: outsourceMilling.length,
          total: manufacturingQueue.length
        },
        scripts: manufacturingQueue
      };
    },
    staleTime: Infinity, // Prevent automatic refetching
    gcTime: 0, // Don't cache the data (previously cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: true, // Fetch when component mounts
  });
};