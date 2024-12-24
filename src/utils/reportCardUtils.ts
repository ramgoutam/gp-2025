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
      .single();

    if (labScriptError) throw labScriptError;

    const { data, error } = await supabase
      .from('report_cards')
      .upsert({
        lab_script_id: labScriptId,
        patient_id: labScript.patient_id,
        design_info: state.designInfo as Json,
        clinical_info: state.clinicalInfo as Json,
        report_status: state.reportStatus
      }, {
        onConflict: 'lab_script_id'
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error saving report card state:", error);
      throw error;
    }

    console.log("Successfully saved report card state:", data);
    return data;
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