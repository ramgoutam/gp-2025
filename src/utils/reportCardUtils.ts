import { supabase } from "@/integrations/supabase/client";
import { ReportCardState, DesignInfo, ClinicalInfo } from "@/types/reportCard";
import { Json } from "@/integrations/supabase/types";

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
          design_info: state.designInfo as Json,
          clinical_info: state.clinicalInfo as Json,
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
          design_info: state.designInfo as Json,
          clinical_info: state.clinicalInfo as Json,
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
    const { data, error } = await supabase
      .from('report_cards')
      .select('*')
      .eq('lab_script_id', labScriptId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching report card state:", error);
      throw error;
    }

    if (!data) {
      console.log("No report card data found");
      return null;
    }

    const designInfo = data.design_info as DesignInfo | null;
    const clinicalInfo = data.clinical_info as ClinicalInfo | null;

    console.log("Successfully retrieved report card state:", data);
    
    return {
      reportStatus: data.report_status || 'pending',
      isDesignInfoComplete: !!designInfo,
      isClinicalInfoComplete: !!clinicalInfo,
      designInfo,
      clinicalInfo
    };
  } catch (error) {
    console.error("Error in getReportCardState:", error);
    throw error;
  }
};