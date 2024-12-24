import { supabase } from "@/integrations/supabase/client";
import { ReportCardState, DesignInfo, ClinicalInfo } from "@/types/reportCard";

export const saveReportCardState = async (
  labScriptId: string,
  state: ReportCardState
) => {
  console.log("Saving report card state:", { labScriptId, state });
  
  try {
    const { data, error } = await supabase
      .from('report_cards')
      .upsert({
        lab_script_id: labScriptId,
        design_info: state.designInfo || null,
        clinical_info: state.clinicalInfo || null,
        report_status: state.reportStatus
      })
      .select('*')
      .single();

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
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log("No report card found for lab script:", labScriptId);
        return null;
      }
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