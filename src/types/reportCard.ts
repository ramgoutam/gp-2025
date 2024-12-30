import { ClinicalInfo } from "./clinicalInfo";
import { DesignInfo } from "./designInfo";

export type InfoStatus = 'pending' | 'in_progress' | 'completed';

export interface ReportCard {
  id: string;
  lab_script_id?: string;
  patient_id: string;
  design_info_id?: string;
  clinical_info_id?: string;
  design_info_status: InfoStatus;
  clinical_info_status: InfoStatus;
  status: InfoStatus;
  created_at: string;
  updated_at: string;
  design_info?: DesignInfo;
  clinical_info?: ClinicalInfo;
}

export interface ReportCardData extends ReportCard {
  patient_name?: string;
  doctor_name?: string;
  clinic_name?: string;
  appliance_type?: string;
}

export interface ReportCardState {
  reportStatus: InfoStatus;
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
}

export { ClinicalInfo, DesignInfo };