import { ClinicalInfo } from "./clinicalInfo";
import { DesignInfo } from "./designInfo";

export interface ReportCard {
  id: string;
  lab_script_id?: string;
  patient_id: string;
  design_info_id?: string;
  clinical_info_id?: string;
  design_info_status: string;
  clinical_info_status: string;
  status: string;
  created_at: string;
  updated_at: string;
  design_info?: DesignInfo;
  clinical_info?: ClinicalInfo;
}