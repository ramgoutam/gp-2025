export type LabScriptStatus = "pending" | "processing" | "in_progress" | "paused" | "hold" | "completed";

export interface DesignInfo {
  report_card_id: string;
  design_date: string;
  implant_library?: string;
  teeth_library?: string;
  actions_taken?: string;
  appliance_type?: string;
  upper_treatment?: string;
  lower_treatment?: string;
  screw?: string;
  upper_design_name?: string;
  lower_design_name?: string;
}

export interface ClinicalInfo {
  report_card_id: string;
  insertion_date: string;
  appliance_fit?: string;
  design_feedback?: string;
  occlusion?: string;
  esthetics?: string;
  adjustments_made?: string;
  material?: string;
  shade?: string;
}

export interface ReportCard {
  id: string;
  lab_script_id: string;
  patient_id: string;
  design_info?: DesignInfo;
  clinical_info?: ClinicalInfo;
  design_info_status: string;
  clinical_info_status: string;
  status: string;
}

export interface LabScript {
  id: string;
  request_number?: string;
  patient_id?: string;
  doctor_name: string;
  clinic_name: string;
  request_date: string;
  due_date: string;
  status: LabScriptStatus;
  upper_treatment?: string;
  lower_treatment?: string;
  upper_design_name?: string;
  lower_design_name?: string;
  appliance_type?: string;
  screw_type?: string;
  vdo_option?: string;
  specific_instructions?: string;
  manufacturing_source?: string;
  manufacturing_type?: string;
  material?: string;
  shade?: string;
  design_info?: DesignInfo;
  clinical_info?: ClinicalInfo;
  report_card?: ReportCard;
  file_uploads?: Record<string, File>;
}

export interface DatabaseLabScript {
  id: string;
  request_number?: string;
  patient_id?: string;
  doctor_name: string;
  clinic_name: string;
  request_date: string;
  due_date: string;
  status: string;
  upper_treatment?: string;
  lower_treatment?: string;
  upper_design_name?: string;
  lower_design_name?: string;
  appliance_type?: string;
  screw_type?: string;
  vdo_option?: string;
  specific_instructions?: string;
  created_at: string;
  updated_at: string;
  manufacturing_source?: string;
  manufacturing_type?: string;
  material?: string;
  shade?: string;
}

export const mapDatabaseLabScript = (dbScript: DatabaseLabScript): LabScript => {
  return {
    id: dbScript.id,
    request_number: dbScript.request_number,
    patient_id: dbScript.patient_id,
    doctor_name: dbScript.doctor_name,
    clinic_name: dbScript.clinic_name,
    request_date: dbScript.request_date,
    due_date: dbScript.due_date,
    status: dbScript.status as LabScriptStatus,
    upper_treatment: dbScript.upper_treatment,
    lower_treatment: dbScript.lower_treatment,
    upper_design_name: dbScript.upper_design_name,
    lower_design_name: dbScript.lower_design_name,
    appliance_type: dbScript.appliance_type,
    screw_type: dbScript.screw_type,
    vdo_option: dbScript.vdo_option,
    specific_instructions: dbScript.specific_instructions,
    manufacturing_source: dbScript.manufacturing_source,
    manufacturing_type: dbScript.manufacturing_type,
    material: dbScript.material,
    shade: dbScript.shade,
  };
};

export const mapLabScriptToDatabase = (script: LabScript): Partial<DatabaseLabScript> => {
  return {
    id: script.id,
    request_number: script.request_number,
    patient_id: script.patient_id,
    doctor_name: script.doctor_name,
    clinic_name: script.clinic_name,
    request_date: script.request_date,
    due_date: script.due_date,
    status: script.status,
    upper_treatment: script.upper_treatment,
    lower_treatment: script.lower_treatment,
    upper_design_name: script.upper_design_name,
    lower_design_name: script.lower_design_name,
    appliance_type: script.appliance_type,
    screw_type: script.screw_type,
    vdo_option: script.vdo_option,
    specific_instructions: script.specific_instructions,
    manufacturing_source: script.manufacturing_source,
    manufacturing_type: script.manufacturing_type,
    material: script.material,
    shade: script.shade,
  };
};