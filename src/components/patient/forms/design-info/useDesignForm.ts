import { useState, useEffect } from "react";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";

export const useDesignForm = (
  script: LabScript, 
  onSave: (updatedScript: LabScript) => void, 
  onClose: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designData, setDesignData] = useState({
    design_date: script.designInfo?.design_date || new Date().toISOString().split('T')[0],
    appliance_type: script.designInfo?.appliance_type || script.applianceType || "",
    upper_treatment: script.designInfo?.upper_treatment || script.upperTreatment || "None",
    lower_treatment: script.designInfo?.lower_treatment || script.lowerTreatment || "None",
    upper_design_name: script.designInfo?.upper_design_name || script.upperDesignName || "",
    lower_design_name: script.designInfo?.lower_design_name || script.lowerDesignName || "",
    screw: script.designInfo?.screw || script.screwType || "",
    implant_library: script.designInfo?.implant_library || "",
    teeth_library: script.designInfo?.teeth_library || "",
    actions_taken: script.designInfo?.actions_taken || "",
  });

  // Sync with lab script values when they change
  useEffect(() => {
    console.log("Syncing design data with lab script:", script);
    setDesignData(prev => ({
      ...prev,
      appliance_type: script.applianceType || prev.appliance_type,
      upper_treatment: script.upperTreatment || prev.upper_treatment,
      lower_treatment: script.lowerTreatment || prev.lower_treatment,
      screw: script.screwType || prev.screw,
    }));
  }, [script.applianceType, script.upperTreatment, script.lowerTreatment, script.screwType]);

  // Fetch latest design info data when form opens
  useEffect(() => {
    const fetchDesignInfo = async () => {
      if (!script.id) return;

      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select(`
          *,
          design_info:design_info_id(*)
        `)
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (reportCardError) {
        console.error("Error fetching design info:", reportCardError);
        return;
      }

      if (reportCard?.design_info) {
        console.log("Found existing design info:", reportCard.design_info);
        setDesignData(prev => ({
          ...prev,
          ...reportCard.design_info,
          // Keep lab script values if they exist and are different
          appliance_type: script.applianceType || reportCard.design_info.appliance_type || prev.appliance_type,
          upper_treatment: script.upperTreatment || reportCard.design_info.upper_treatment || prev.upper_treatment,
          lower_treatment: script.lowerTreatment || reportCard.design_info.lower_treatment || prev.lower_treatment,
          screw: script.screwType || reportCard.design_info.screw || prev.screw,
        }));
      }
    };

    fetchDesignInfo();
  }, [script.id]);

  const handleDesignDataChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (scriptId: string) => {
    console.log("Saving design info for script:", scriptId, designData);
    
    try {
      setIsSubmitting(true);
      
      // First, get or create report card
      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', scriptId)
        .maybeSingle();

      if (reportCardError) throw reportCardError;

      let reportCardId;
      if (reportCard) {
        reportCardId = reportCard.id;
      } else {
        const { data: newReportCard, error: createError } = await supabase
          .from('report_cards')
          .insert({
            lab_script_id: scriptId,
            patient_id: script.patientId,
            design_info_status: 'completed',
            clinical_info_status: 'pending'
          })
          .select()
          .single();

        if (createError) throw createError;
        reportCardId = newReportCard.id;
      }

      // Save design info
      const designInfoData = {
        ...designData,
        report_card_id: reportCardId
      };

      let designInfo;
      if (reportCard?.design_info_id) {
        console.log("Updating existing design info:", reportCard.design_info_id);
        const { data: updatedInfo, error: updateError } = await supabase
          .from('design_info')
          .update(designInfoData)
          .eq('id', reportCard.design_info_id)
          .select()
          .single();

        if (updateError) throw updateError;
        designInfo = updatedInfo;
      } else {
        console.log("Creating new design info");
        const { data: newInfo, error: createError } = await supabase
          .from('design_info')
          .insert(designInfoData)
          .select()
          .single();

        if (createError) throw createError;

        // Update report card with design_info_id
        const { error: updateError } = await supabase
          .from('report_cards')
          .update({ 
            design_info_id: newInfo.id,
            design_info_status: 'completed'
          })
          .eq('id', reportCardId);

        if (updateError) throw updateError;
        designInfo = newInfo;
      }

      // Update lab script with latest values
      const { error: labScriptError } = await supabase
        .from('lab_scripts')
        .update({
          appliance_type: designData.appliance_type,
          upper_treatment: designData.upper_treatment,
          lower_treatment: designData.lower_treatment,
          upper_design_name: designData.upper_design_name,
          lower_design_name: designData.lower_design_name,
          screw_type: designData.screw,
          updated_at: new Date().toISOString()
        })
        .eq('id', scriptId);

      if (labScriptError) throw labScriptError;

      const updatedScript: LabScript = {
        ...script,
        applianceType: designData.appliance_type,
        upperTreatment: designData.upper_treatment,
        lowerTreatment: designData.lower_treatment,
        upperDesignName: designData.upper_design_name,
        lowerDesignName: designData.lower_design_name,
        screwType: designData.screw,
        designInfo: designInfo
      };

      console.log("Successfully saved design info:", designInfo);
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
