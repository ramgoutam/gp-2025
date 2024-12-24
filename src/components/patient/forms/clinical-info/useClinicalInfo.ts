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
      // Get the report card for this lab script
      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .single();

      if (reportCardError) {
        console.error("Error fetching report card:", reportCardError);
        throw reportCardError;
      }

      // Create clinical info entry
      const { data: clinicalInfo, error: clinicalError } = await supabase
        .from('clinical_info')
        .insert({
          ...formData,
          report_card_id: reportCard.id // Add report_card_id
        })
        .select()
        .single();

      if (clinicalError) {
        console.error("Error saving clinical info:", clinicalError);
        throw clinicalError;
      }

      // Update report card with clinical info status
      const { error: updateError } = await supabase
        .from('report_cards')
        .update({ 
          clinical_info_id: clinicalInfo.id,
          clinical_info_status: 'completed'
        })
        .eq('id', reportCard.id);

      if (updateError) {
        console.error("Error updating report card:", updateError);
        throw updateError;
      }

      // Update the script with the new clinical info
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
    }
  };

  return {
    formData,
    handleFieldChange,
    handleSubmit
  };
};