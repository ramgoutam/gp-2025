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

  // Fetch existing clinical info when component mounts
  useEffect(() => {
    const fetchExistingClinicalInfo = async () => {
      try {
        console.log("Fetching clinical info for script:", script.id);
        
        // First get the report card
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
          console.error("No report card found for script:", script.id);
          return;
        }

        if (!reportCard.clinical_info_id) {
          console.log("No clinical info exists yet for this report card");
          return;
        }

        // Then get the clinical info
        const { data: clinicalInfo, error: clinicalError } = await supabase
          .from('clinical_info')
          .select('*')
          .eq('id', reportCard.clinical_info_id)
          .maybeSingle();

        if (clinicalError) {
          console.error("Error fetching clinical info:", clinicalError);
          throw clinicalError;
        }

        if (clinicalInfo) {
          console.log("Found existing clinical info:", clinicalInfo);
          setFormData({
            insertion_date: clinicalInfo.insertion_date || new Date().toISOString().split('T')[0],
            appliance_fit: clinicalInfo.appliance_fit || "",
            design_feedback: clinicalInfo.design_feedback || "",
            occlusion: clinicalInfo.occlusion || "",
            esthetics: clinicalInfo.esthetics || "",
            adjustments_made: clinicalInfo.adjustments_made || "",
            material: clinicalInfo.material || "",
            shade: clinicalInfo.shade || "",
          });
        }
      } catch (error) {
        console.error("Error in fetchExistingClinicalInfo:", error);
        toast({
          title: "Error",
          description: "Failed to load existing clinical information",
          variant: "destructive"
        });
      }
    };

    fetchExistingClinicalInfo();
  }, [script.id]);

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

      // If clinical info already exists, update it
      if (reportCard.clinical_info_id) {
        console.log("Updating existing clinical info:", reportCard.clinical_info_id);
        const { data: updatedInfo, error: updateError } = await supabase
          .from('clinical_info')
          .update(formData)
          .eq('id', reportCard.clinical_info_id)
          .select()
          .maybeSingle();

        if (updateError) {
          console.error("Error updating clinical info:", updateError);
          throw updateError;
        }

        if (!updatedInfo) {
          console.error("Failed to update clinical info");
          throw new Error("Failed to update clinical info");
        }

        clinicalInfo = updatedInfo;
      } else {
        // Create new clinical info
        console.log("Creating new clinical info");
        const { data: newInfo, error: createError } = await supabase
          .from('clinical_info')
          .insert({
            ...formData,
            report_card_id: reportCard.id
          })
          .select()
          .maybeSingle();

        if (createError) {
          console.error("Error creating clinical info:", createError);
          throw createError;
        }

        if (!newInfo) {
          console.error("Failed to create clinical info");
          throw new Error("Failed to create clinical info");
        }

        // Update report card with clinical info id
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