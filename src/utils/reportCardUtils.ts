import { supabase } from "@/integrations/supabase/client";
import { ReportCardState } from "@/types/reportCard";
import { DesignInfo, ClinicalInfo } from "@/types/labScript";
import { Json } from "@/integrations/supabase/types";

export const saveReportCardState = async (
  labScriptId: string,
  state: ReportCardState
) => {
  try {
    console.log("Saving report card state to database:", { labScriptId, state });

    const { data, error } = await supabase
      .from('report_cards')
      .upsert({
        lab_script_id: labScriptId,
        design_info: state.designInfo as Json,
        clinical_info: state.clinicalInfo as Json,
        report_status: state.reportStatus,
      }, {
        onConflict: 'lab_script_id'
      })
      .select()
      .single();

    if (error) throw error;
    console.log("Successfully saved report card state:", data);
    return data;
  } catch (error) {
    console.error("Error saving report card state:", error);
    throw error;
  }
};

export const getReportCardState = async (labScriptId: string): Promise<ReportCardState | null> => {
  try {
    const { data, error } = await supabase
      .from('report_cards')
      .select('*')
      .eq('lab_script_id', labScriptId)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      reportStatus: data.report_status,
      isDesignInfoComplete: !!data.design_info,
      isClinicalInfoComplete: !!data.clinical_info,
      designInfo: data.design_info as DesignInfo,
      clinicalInfo: data.clinical_info as ClinicalInfo,
    };
  } catch (error) {
    console.error("Error getting report card state:", error);
    throw error;
  }
};