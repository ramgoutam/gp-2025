import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";

export const useManufacturingData = () => {
  return useQuery({
    queryKey: ['manufacturingData'],
    queryFn: async () => {
      const { data: scripts, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patient:patients(
            first_name,
            last_name
          ),
          report_card:report_cards(
            design_info_status,
            clinical_info_status,
            design_info:design_info(*),
            clinical_info:clinical_info(*)
          ),
          manufacturing_logs(*)
        `)
        .eq('manufacturing_source', 'Inhouse')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching manufacturing data:", error);
        throw error;
      }

      return scripts.map((script): LabScript => ({
        ...script,
        patientFirstName: script.patient?.first_name || '',
        patientLastName: script.patient?.last_name || '',
        designInfo: script.report_card?.design_info || [],
        clinicalInfo: script.report_card?.clinical_info || [],
        designInfoStatus: script.report_card?.design_info_status || 'pending',
        clinicalInfoStatus: script.report_card?.clinical_info_status || 'pending',
        manufacturingLogs: script.manufacturing_logs || []
      }));
    }
  });
};