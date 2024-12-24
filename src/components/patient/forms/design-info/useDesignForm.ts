import { useState } from "react";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";

export const useDesignForm = (script: LabScript, onSave: (updatedScript: LabScript) => void, onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designData, setDesignData] = useState({
    design_date: script.designInfo?.design_date || new Date().toISOString().split('T')[0],
    appliance_type: script.designInfo?.appliance_type || script.applianceType || "",
    upper_treatment: script.designInfo?.upper_treatment || script.upperTreatment || "",
    lower_treatment: script.designInfo?.lower_treatment || script.lowerTreatment || "",
    screw: script.designInfo?.screw || script.screwType || "",
    implant_library: script.designInfo?.implant_library || "",
    teeth_library: script.designInfo?.teeth_library || "",
    actions_taken: script.designInfo?.actions_taken || "",
  });

  const handleDesignDataChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (scriptId: string) => {
    console.log("Saving design info for script:", scriptId, designData);
    
    try {
      setIsSubmitting(true);
      
      // Get the report card for this lab script
      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', scriptId)
        .maybeSingle();

      if (reportCardError) {
        console.error("Error fetching report card:", reportCardError);
        throw reportCardError;
      }

      if (!reportCard) {
        console.error("No report card found");
        throw new Error("No report card found for this lab script");
      }

      let designInfo;

      // Ensure design_date is never empty
      const designDataToSave = {
        ...designData,
        design_date: designData.design_date || new Date().toISOString().split('T')[0]
      };

      if (reportCard.design_info_id) {
        console.log("Updating existing design info:", reportCard.design_info_id);
        const { data: updatedInfo, error: updateError } = await supabase
          .from('design_info')
          .update(designDataToSave)
          .eq('id', reportCard.design_info_id)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating design info:", updateError);
          throw updateError;
        }

        designInfo = updatedInfo;
      } else {
        console.log("Creating new design info");
        const { data: newInfo, error: createError } = await supabase
          .from('design_info')
          .insert({
            ...designDataToSave,
            report_card_id: reportCard.id
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating design info:", createError);
          throw createError;
        }

        // Update report card with design_info_id
        const { error: updateError } = await supabase
          .from('report_cards')
          .update({ 
            design_info_id: newInfo.id,
            design_info_status: 'completed'
          })
          .eq('id', reportCard.id);

        if (updateError) {
          console.error("Error updating report card:", updateError);
          throw updateError;
        }

        designInfo = newInfo;
      }

      const updatedScript: LabScript = {
        ...script,
        designInfo: designInfo
      };

      onSave(updatedScript);
      onClose();
      
      return { success: true };
    } catch (error) {
      console.error("Error saving design info:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    designData,
    isSubmitting,
    handleDesignDataChange,
    handleSave
  };
};