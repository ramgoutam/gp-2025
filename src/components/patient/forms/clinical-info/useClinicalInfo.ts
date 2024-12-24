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
      const { data: existingReport, error: fetchError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching report card:", fetchError);
        throw fetchError;
      }

      let reportCardId;
      
      if (existingReport) {
        reportCardId = existingReport.id;
        console.log("Found existing report card:", reportCardId);
      } else {
        // Create new report card
        const { data: newReport, error: createError } = await supabase
          .from('report_cards')
          .insert({
            lab_script_id: script.id,
            patient_id: script.patientId,
            clinical_info_status: 'completed',
            design_info_status: 'pending'
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating report card:", createError);
          throw createError;
        }
        reportCardId = newReport.id;
        console.log("Created new report card:", reportCardId);
      }

      // Now handle the clinical info
      const { data: existingClinicalInfo, error: clinicalFetchError } = await supabase
        .from('clinical_info')
        .select('*')
        .eq('id', existingReport?.clinical_info_id)
        .maybeSingle();

      if (clinicalFetchError) {
        console.error("Error fetching clinical info:", clinicalFetchError);
        throw clinicalFetchError;
      }

      let clinicalInfoOperation;
      if (existingClinicalInfo) {
        clinicalInfoOperation = supabase
          .from('clinical_info')
          .update(formData)
          .eq('id', existingClinicalInfo.id)
          .select();
      } else {
        clinicalInfoOperation = supabase
          .from('clinical_info')
          .insert({
            ...formData
          })
          .select();
      }

      const { data: clinicalInfo, error: saveError } = await clinicalInfoOperation;
      if (saveError) {
        console.error("Error saving clinical info:", saveError);
        throw saveError;
      }

      // Update report card with clinical_info_id and status
      const { error: updateError } = await supabase
        .from('report_cards')
        .update({ 
          clinical_info_id: clinicalInfo[0].id,
          clinical_info_status: 'completed'
        })
        .eq('id', reportCardId);

      if (updateError) {
        console.error("Error updating report card:", updateError);
        throw updateError;
      }

      const updatedScript: LabScript = {
        ...script,
        clinicalInfo: {
          ...formData,
          id: clinicalInfo[0].id
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