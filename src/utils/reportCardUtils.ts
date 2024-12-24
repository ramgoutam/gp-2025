import { supabase } from "@/integrations/supabase/client";
import { ReportCardState, DesignInfo, ClinicalInfo } from "@/types/reportCard";

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
      design_info: state.designInfo,
      clinical_info: state.clinicalInfo,
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
  
  const designInfo = data.design_info as DesignInfo;
  const clinicalInfo = data.clinical_info as ClinicalInfo;
  
  return {
    reportStatus: data.report_status,
    isDesignInfoComplete: !!designInfo,
    isClinicalInfoComplete: !!clinicalInfo,
    designInfo: designInfo || {
      designDate: "",
      applianceType: "",
      upperTreatment: "",
      lowerTreatment: "",
      screw: "",
      implantLibrary: "",
      teethLibrary: "",
      actionsTaken: ""
    },
    clinicalInfo: clinicalInfo || {
      insertionDate: "",
      applianceFit: "",
      designFeedback: "",
      occlusion: "",
      esthetics: "",
      adjustmentsMade: "",
      material: "",
      shade: ""
    }
  };
};