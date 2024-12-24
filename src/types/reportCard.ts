import { Json } from "@/integrations/supabase/types";

export interface DesignInfo {
  id?: string;
  design_date: string;
  appliance_type?: string;
  upper_treatment?: string;
  lower_treatment?: string;
  screw?: string;
  implant_library?: string;
  teeth_library?: string;
  actions_taken?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClinicalInfo {
  id?: string;
  insertion_date?: string;
  appliance_fit?: string;
  design_feedback?: string;
  occlusion?: string;
  esthetics?: string;
  adjustments_made?: string;
  material?: string;
  shade?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportCardState {
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
  designInfo?: DesignInfo;
  clinicalInfo?: ClinicalInfo;
  designInfoStatus?: 'pending' | 'completed';
  clinicalInfoStatus?: 'pending' | 'completed';
}

export interface ReportCardData {
  id: string;
  lab_script_id: string | null;
  created_at: string;
  updated_at: string;
  patient_id: string;
  design_info_id: string | null;
  clinical_info_id: string | null;
  design_info_status: 'pending' | 'completed';
  clinical_info_status: 'pending' | 'completed';
}