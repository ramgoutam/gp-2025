import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";

export interface ReportCardState {
  reportStatus: string;
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
  designInfo?: {
    designDate: string;
    applianceType: string;
    upperTreatment: string;
    lowerTreatment: string;
    screw: string;
    implantLibrary: string;
    teethLibrary: string;
    actionsTaken: string;
  };
  clinicalInfo?: {
    insertionDate: string;
    applianceFit: string;
    designFeedback: string;
    occlusion: string;
    esthetics: string;
    adjustmentsMade: string;
    material: string;
    shade: string;
  };
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
    .maybeSingle();

  if (error) {
    console.error("Error saving report card state:", error);
    throw error;
  }

  console.log("Successfully saved report card state:", data);
  return data;
};

export const getReportCardState = async (labScriptId: string): Promise<ReportCardState | null> => {
  console.log("Fetching report card state for script:", labScriptId);
  
  // Get the most recent report card for this lab script
  const { data, error } = await supabase
    .from('report_cards')
    .select('*')
    .eq('lab_script_id', labScriptId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching report card state:", error);
    throw error;
  }

  if (!data) {
    console.log("No report card found for script:", labScriptId);
    return null;
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