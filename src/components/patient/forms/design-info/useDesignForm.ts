import { useState } from "react";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";

export const useDesignForm = (
  script: LabScript, 
  onSave: (updatedScript: LabScript) => void, 
  onClose: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form data with existing design info if available
  const [designData, setDesignData] = useState({
    design_date: script.designInfo?.design_date || new Date().toISOString().split('T')[0],
    appliance_type: script.designInfo?.appliance_type || script.applianceType || "",
    upper_treatment: script.designInfo?.upper_treatment || script.upperTreatment || "",
    lower_treatment: script.designInfo?.lower_treatment || script.lowerTreatment || "",
    upper_design_name: script.designInfo?.upper_design_name || script.upperDesignName || "",
    lower_design_name: script.designInfo?.lower_design_name || script.lowerDesignName || "",
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

      if (reportCardError) throw reportCardError;
      if (!reportCard) throw new Error("No report card found for this lab script");

      let designInfo;

      if (reportCard.design_info_id) {
        console.log("Updating existing design info:", reportCard.design_info_id);
        const { data: updatedInfo, error: updateError } = await supabase
          .from('design_info')
          .update(designData)
          .eq('id', reportCard.design_info_id)
          .select()
          .single();

        if (updateError) throw updateError;
        designInfo = updatedInfo;
      } else {
        console.log("Creating new design info");
        const { data: newInfo, error: createError } = await supabase
          .from('design_info')
          .insert({
            ...designData,
            report_card_id: reportCard.id
          })
          .select()
          .single();

        if (createError) throw createError;

        // Update report card with design_info_id and status
        const { error: updateError } = await supabase
          .from('report_cards')
          .update({ 
            design_info_id: newInfo.id,
            design_info_status: 'completed'
          })
          .eq('id', reportCard.id);

        if (updateError) throw updateError;
        designInfo = newInfo;
      }

      // Create updated script object
      const updatedScript: LabScript = {
        ...script,
        designInfo: designInfo
      };

      console.log("Successfully saved design info");
      return { success: true, updatedScript };
    } catch (error) {
      console.error("Error in saveDesignInfo:", error);
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