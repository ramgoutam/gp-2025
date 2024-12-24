import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";

export interface ReportCardState {
  reportStatus: string;
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
  designInfo?: any;
  clinicalInfo?: any;
}

export const saveReportCardState = async (
  labScriptId: string, 
  state: ReportCardState
) => {
  console.log("Saving report card state to database:", { labScriptId, state });

  const { data, error } = await supabase
    .from('report_cards')
    .upsert({
      lab_script_id: labScriptId,
      report_status: state.reportStatus,
      design_info: state.designInfo || null,
      clinical_info: state.clinicalInfo || null,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving report card state:", error);
    throw error;
  }

  console.log("Successfully saved report card state:", data);
  return data;
};

export const getReportCardState = async (labScriptId: string): Promise<ReportCardState | null> => {
  console.log("Fetching report card state for script:", labScriptId);
  
  const { data, error } = await supabase
    .from('report_cards')
    .select('*')
    .eq('lab_script_id', labScriptId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log("No report card found for script:", labScriptId);
      return null;
    }
    console.error("Error fetching report card state:", error);
    throw error;
  }

  console.log("Retrieved report card state:", data);
  
  return {
    reportStatus: data.report_status,
    isDesignInfoComplete: !!data.design_info,
    isClinicalInfoComplete: !!data.clinical_info,
    designInfo: data.design_info,
    clinicalInfo: data.clinical_info
  };
};