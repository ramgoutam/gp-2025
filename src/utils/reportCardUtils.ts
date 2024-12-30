import { supabase } from "@/integrations/supabase/client";
import { ReportCardState, DesignInfo, ClinicalInfo } from "@/types/reportCard";

export const saveReportCardState = async (
  labScriptId: string,
  state: ReportCardState
) => {
  console.log("Saving report card state:", { labScriptId, state });
  
  try {
    // First get the patient_id from the lab script
    const { data: labScript, error: labScriptError } = await supabase
      .from('lab_scripts')
      .select('patient_id')
      .eq('id', labScriptId)
      .maybeSingle();

    if (labScriptError) {
      console.error("Error fetching lab script:", labScriptError);
      throw labScriptError;
    }
    if (!labScript) {
      console.error("Lab script not found:", labScriptId);
      throw new Error('Lab script not found');
    }

    // Check if a report card already exists
    const { data: existingReport, error: fetchError } = await supabase
      .from('report_cards')
      .select('*')
      .eq('lab_script_id', labScriptId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error checking existing report:", fetchError);
      throw fetchError;
    }

    let reportCardId;

    if (existingReport) {
      reportCardId = existingReport.id;
    } else {
      // Create new report card
      const { data: newReport, error: createError } = await supabase
        .from('report_cards')
        .insert({
          lab_script_id: labScriptId,
          patient_id: labScript.patient_id
        })
        .select()
        .single();

      if (createError) throw createError;
      reportCardId = newReport.id;
    }

    // Handle design info
    if (state.designInfo) {
      const { data: designInfo, error: designError } = await supabase
        .from('design_info')
        .insert(state.designInfo)
        .select()
        .single();

      if (designError) throw designError;

      // Update report card with design_info_id
      await supabase
        .from('report_cards')
        .update({ design_info_id: designInfo.id })
        .eq('id', reportCardId);
    }

    // Handle clinical info
    if (state.clinicalInfo) {
      const { data: clinicalInfo, error: clinicalError } = await supabase
        .from('clinical_info')
        .insert(state.clinicalInfo)
        .select()
        .single();

      if (clinicalError) throw clinicalError;

      // Update report card with clinical_info_id
      await supabase
        .from('report_cards')
        .update({ clinical_info_id: clinicalInfo.id })
        .eq('id', reportCardId);
    }

    console.log("Successfully saved report card state");
    return reportCardId;
  } catch (error) {
    console.error("Error in saveReportCardState:", error);
    throw error;
  }
};

export const getReportCardState = async (
  labScriptId: string
): Promise<ReportCardState | null> => {
  console.log("Getting report card state for lab script:", labScriptId);
  
  try {
    const { data: reportCard, error: reportError } = await supabase
      .from('report_cards')
      .select(`
        *,
        design_info:design_info_id (*),
        clinical_info:clinical_info_id (*)
      `)
      .eq('lab_script_id', labScriptId)
      .maybeSingle();

    if (reportError) {
      console.error("Error fetching report card state:", reportError);
      throw reportError;
    }

    if (!reportCard) {
      console.log("No report card data found");
      return null;
    }

    console.log("Successfully retrieved report card state:", reportCard);
    
    return {
      isDesignInfoComplete: !!reportCard.design_info,
      isClinicalInfoComplete: !!reportCard.clinical_info,
      designInfo: reportCard.design_info,
      clinicalInfo: reportCard.clinical_info
    };
  } catch (error) {
    console.error("Error in getReportCardState:", error);
    throw error;
  }
};