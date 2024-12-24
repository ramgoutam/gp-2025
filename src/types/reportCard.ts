import { Json } from "@/integrations/supabase/types";

export interface DesignInfo {
  designDate?: string;
  applianceType?: string;
  upperTreatment?: string;
  lowerTreatment?: string;
  screw?: string;
  implantLibrary?: string;
  teethLibrary?: string;
  actionsTaken?: string;
}

export interface ClinicalInfo {
  insertionDate?: string;
  applianceFit?: string;
  designFeedback?: string;
  occlusion?: string;
  esthetics?: string;
  adjustmentsMade?: string;
  material?: string;
  shade?: string;
}

export interface ReportCardState {
  reportStatus: string;
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
  designInfo?: DesignInfo | null;
  clinicalInfo?: ClinicalInfo | null;
}

export interface ReportCardData {
  id: string;
  lab_script_id: string | null;
  design_info: Json | null;
  clinical_info: Json | null;
  report_status: string | null;
  created_at: string;
  updated_at: string;
}