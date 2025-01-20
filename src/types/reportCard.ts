export type InfoStatus = 'pending' | 'completed';

export interface DesignInfo {
  id: string;
  design_date: string;
  appliance_type?: string;
  upper_treatment?: string;
  lower_treatment?: string;
  upper_design_name?: string;
  lower_design_name?: string;
  screw?: string;
  implant_library?: string;
  teeth_library?: string;
  actions_taken?: string;
  created_at?: string;
  updated_at?: string;
  report_card_id: string;
}

export interface ClinicalInfo {
  id: string;
  insertion_date: string | null;
  appliance_fit?: string;
  design_feedback?: string;
  occlusion?: string;
  esthetics?: string;
  adjustments_made?: string;
  material?: string;
  shade?: string;
  created_at?: string;
  updated_at?: string;
  report_card_id: string;
}

export interface ReportCardState {
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
  designInfo?: DesignInfo;
  clinicalInfo?: ClinicalInfo;
  designInfoStatus?: InfoStatus;
  clinicalInfoStatus?: InfoStatus;
}

export interface ReportCardData {
  id: string;
  lab_script_id: string | null;
  created_at: string;
  updated_at: string;
  patient_id: string;
  design_info_id: string | null;
  clinical_info_id: string | null;
  design_info_status: InfoStatus;
  clinical_info_status: InfoStatus;
  status: InfoStatus;
  design_info?: DesignInfo;
  clinical_info?: ClinicalInfo;
}

export interface ReportCardProps {
  script: {
    id: string;
    requestNumber?: string;
    status: string;
    requestDate: string;
    designInfo?: DesignInfo;
    clinicalInfo?: ClinicalInfo;
  };
  onDesignInfo: (script: { id: string }) => void;
  onClinicalInfo: () => void;
  onUpdateScript?: (script: { id: string }) => void;
}