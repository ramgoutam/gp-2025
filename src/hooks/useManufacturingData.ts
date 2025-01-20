import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";

export const useManufacturingData = () => {
  return useQuery({
    queryKey: ['manufacturingData'],
    queryFn: async () => {
      console.log("Fetching manufacturing data");
      
      const { data: scripts, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching manufacturing data:", error);
        throw error;
      }

      console.log("Retrieved manufacturing scripts:", scripts);

      return scripts.map(script => ({
        id: script.id,
        requestNumber: script.request_number,
        patientId: script.patient_id,
        doctorName: script.doctor_name,
        clinicName: script.clinic_name,
        requestDate: script.request_date,
        dueDate: script.due_date,
        status: script.status,
        patientFirstName: script.patients?.first_name,
        patientLastName: script.patients?.last_name,
        designInfo: script.report_cards?.[0]?.design_info || null,
        clinicalInfo: script.report_cards?.[0]?.clinical_info || null,
        designInfoStatus: script.report_cards?.[0]?.design_info_status || 'pending',
        clinicalInfoStatus: script.report_cards?.[0]?.clinical_info_status || 'pending',
        manufacturingSource: script.manufacturing_source,
        manufacturingType: script.manufacturing_type,
        material: script.material,
        shade: script.shade,
        upperTreatment: script.upper_treatment,
        lowerTreatment: script.lower_treatment,
        upperDesignName: script.upper_design_name,
        lowerDesignName: script.lower_design_name,
        applianceType: script.appliance_type,
        screwType: script.screw_type,
        vdoOption: script.vdo_option,
        specificInstructions: script.specific_instructions,
        manufacturingLogs: script.manufacturing_logs
      })) as LabScript[];
    },
    refetchInterval: 1000
  });
};