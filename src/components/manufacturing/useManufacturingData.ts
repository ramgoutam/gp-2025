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
          patients!inner (
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
        const patient = script.patients;
        const reportCard = script.report_cards?.[0];

        // First map the base lab script data
        const baseScript = mapDatabaseLabScript({
          ...script,
          manufacturing_logs: Array.isArray(script.manufacturing_logs) 
            ? script.manufacturing_logs 
            : script.manufacturing_logs 
              ? [script.manufacturing_logs]
              : []
        });

        // Then add the additional properties
        return {
          ...baseScript,
          patientFirstName: patient?.first_name,
          patientLastName: patient?.last_name,
          designInfo: reportCard?.design_info || undefined,
          clinicalInfo: reportCard?.clinical_info || undefined,
          designInfoStatus: reportCard?.design_info_status || 'pending',
          clinicalInfoStatus: reportCard?.clinical_info_status || 'pending',
        };
      });

      // Filter scripts that have manufacturing source and type
      const manufacturingQueue = mappedScripts.filter(s => 
        s.manufacturingSource && s.manufacturingType
      );

      // Calculate counts for each category based on manufacturing status and type
      const inhousePrinting = manufacturingQueue.filter(s => {
        if (s.manufacturingSource !== 'Inhouse' || s.manufacturingType !== 'Printing') return false;
        
        const log = s.manufacturingLogs?.[0];
        if (!log) return false;

        // For printing workflow:
        // If manufacturing is not completed, count as printing
        if (log.manufacturing_status !== 'completed') return true;
        
        return false;
      }).length;

      const inhouseMiyo = manufacturingQueue.filter(s => {
        if (s.manufacturingSource !== 'Inhouse' || s.manufacturingType !== 'Printing') return false;
        
        const log = s.manufacturingLogs?.[0];
        if (!log) return false;

        // If manufacturing is completed and miyo is not completed, count as miyo
        return log.manufacturing_status === 'completed' && log.miyo_status !== 'completed';
      }).length;

      const inhouseMilling = manufacturingQueue.filter(s => 
        s.manufacturingSource === 'Inhouse' && 
        s.manufacturingType === 'Milling' &&
        s.manufacturingLogs?.[0]?.manufacturing_status !== 'completed'
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
          inhouseMiyo,
          total: manufacturingQueue.length
        },
        scripts: manufacturingQueue
      };
    },
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 0
  });
};