import { useState, useEffect } from "react";
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

  // Fetch latest clinical info data when form opens
  useEffect(() => {
    const fetchClinicalInfo = async () => {
      if (!script.id) return;

      console.log("Fetching clinical info for script:", script.id);

      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select(`
          *,
          clinical_info:clinical_info_id(*)
        `)
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (reportCardError) {
        console.error("Error fetching clinical info:", reportCardError);
        return;
      }

      if (reportCard?.clinical_info) {
        console.log("Found clinical info:", reportCard.clinical_info);
        setFormData({
          insertion_date: reportCard.clinical_info.insertion_date || null,
          appliance_fit: reportCard.clinical_info.appliance_fit || "",
          design_feedback: reportCard.clinical_info.design_feedback || "",
          occlusion: reportCard.clinical_info.occlusion || "",
          esthetics: reportCard.clinical_info.esthetics || "",
          adjustments_made: reportCard.clinical_info.adjustments_made || "",
          material: reportCard.clinical_info.material || "",
          shade: reportCard.clinical_info.shade || "",
        });
      }
    };

    fetchClinicalInfo();
  }, [script.id]);

  console.log("Current clinical info data:", formData);

  const handleFieldChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
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
        insertion_date: formData.insertion_date || null,
        report_card_id: reportCard.id
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
          .insert(submissionData)
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