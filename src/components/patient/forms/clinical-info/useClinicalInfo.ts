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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    insertion_date: script.clinicalInfo?.insertion_date || null,
    appliance_fit: script.clinicalInfo?.appliance_fit || "",
    design_feedback: script.clinicalInfo?.design_feedback || "",
    occlusion: script.clinicalInfo?.occlusion || "",
    esthetics: script.clinicalInfo?.esthetics || "",
    adjustments_made: script.clinicalInfo?.adjustments_made || "",
    material: script.clinicalInfo?.material || "",
    shade: script.clinicalInfo?.shade || "",
  });

  console.log("Initializing clinical info form with data:", formData);

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'insertion_date') {
      setFormData(prev => ({ ...prev, [field]: value || null }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    console.log(`Field ${field} changed to:`, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting clinical info:", formData);

    try {
      setIsSubmitting(true);
      
      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (reportCardError) {
        console.error("Error fetching report card:", reportCardError);
        throw reportCardError;
      }

      if (!reportCard) {
        console.error("No report card found");
        throw new Error("No report card found for this lab script");
      }

      let clinicalInfo;

      const submissionData = {
        ...formData,
        insertion_date: formData.insertion_date || null
      };

      if (reportCard.clinical_info_id) {
        console.log("Updating existing clinical info:", reportCard.clinical_info_id);
        const { data: updatedInfo, error: updateError } = await supabase
          .from('clinical_info')
          .update(submissionData)
          .eq('id', reportCard.clinical_info_id)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating clinical info:", updateError);
          throw updateError;
        }

        clinicalInfo = updatedInfo;
      } else {
        console.log("Creating new clinical info");
        const { data: newInfo, error: createError } = await supabase
          .from('clinical_info')
          .insert({
            ...submissionData,
            report_card_id: reportCard.id
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating clinical info:", createError);
          throw createError;
        }

        const { error: updateError } = await supabase
          .from('report_cards')
          .update({ 
            clinical_info_id: newInfo.id,
            clinical_info_status: 'completed'
          })
          .eq('id', reportCard.id);

        if (updateError) {
          console.error("Error updating report card:", updateError);
          throw updateError;
        }

        clinicalInfo = newInfo;
      }

      const updatedScript: LabScript = {
        ...script,
        clinicalInfo: clinicalInfo
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleFieldChange,
    handleSubmit,
    isSubmitting
  };
};