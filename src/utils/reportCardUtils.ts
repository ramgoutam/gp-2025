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

    let reportCardOperation;
    if (existingReport) {
      // Update existing report card
      console.log("Updating existing report card:", existingReport.id);
      reportCardOperation = supabase
        .from('report_cards')
        .update({
          report_status: state.reportStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReport.id);
    } else {
      // Create new report card
      console.log("Creating new report card for lab script:", labScriptId);
      reportCardOperation = supabase
        .from('report_cards')
        .insert({
          lab_script_id: labScriptId,
          patient_id: labScript.patient_id,
          report_status: state.reportStatus || 'pending'
        });
    }

    const { data: savedData, error: saveError } = await reportCardOperation;
    if (saveError) {
      console.error("Error saving report card:", saveError);
      throw saveError;
    }

    console.log("Successfully saved report card state:", savedData);
    return savedData;
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
        design_info (*),
        clinical_info (*)
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
      reportStatus: reportCard.report_status || 'pending',
      isDesignInfoComplete: !!reportCard.design_info,
      isClinicalInfoComplete: !!reportCard.clinical_info,
    };
  } catch (error) {
    console.error("Error in getReportCardState:", error);
    throw error;
  }
};