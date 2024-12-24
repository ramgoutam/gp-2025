import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";

export const useClinicalInfo = (
  script: LabScript,
  onSave: (updatedScript: LabScript) => void,
  onClose: () => void
) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    insertion_date: new Date().toISOString().split('T')[0],
    appliance_fit: "",
    design_feedback: "",
    occlusion: "",
    esthetics: "",
    adjustments_made: "",
    material: "",
    shade: "",
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting clinical info:", formData);

    try {
      // First, check if a report card exists for this lab script
      const { data: existingReport } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .maybeSingle();

      let reportCardId;
      
      if (existingReport) {
        reportCardId = existingReport.id;
      } else {
        // Create new report card
        const { data: newReport, error: createError } = await supabase
          .from('report_cards')
          .insert({
            lab_script_id: script.id,
            patient_id: script.patientId,
            clinical_info_status: 'completed',
            design_info_status: existingReport?.design_info_status || 'pending'
          })
          .select()
          .single();

        if (createError) throw createError;
        reportCardId = newReport.id;
      }

      // Now handle the clinical info
      const { data: existingClinicalInfo } = await supabase
        .from('clinical_info')
        .select('*')
        .eq('report_card_id', reportCardId)
        .maybeSingle();

      let clinicalInfoOperation;
      if (existingClinicalInfo) {
        clinicalInfoOperation = supabase
          .from('clinical_info')
          .update(formData)
          .eq('id', existingClinicalInfo.id);
      } else {
        clinicalInfoOperation = supabase
          .from('clinical_info')
          .insert({
            report_card_id: reportCardId,
            ...formData
          });
      }

      const { error: saveError } = await clinicalInfoOperation;
      if (saveError) throw saveError;

      // Update report card status
      const { error: updateError } = await supabase
        .from('report_cards')
        .update({ clinical_info_status: 'completed' })
        .eq('id', reportCardId);

      if (updateError) throw updateError;

      const updatedScript: LabScript = {
        ...script,
        clinicalInfo: {
          report_card_id: reportCardId,
          ...formData
        }
      };

      onSave(updatedScript);
      
      toast({
        title: "Success",
        description: "Clinical information saved successfully",
      });

      onClose();
    } catch (error) {
      console.error("Error saving clinical info:", error);
      toast({
        title: "Error",
        description: "Failed to save clinical information",
        variant: "destructive"
      });
    }
  };

  return {
    formData,
    handleFieldChange,
    handleSubmit
  };
};