export type LabScriptStatus = "pending" | "processing" | "in_progress" | "paused" | "hold" | "completed";

export interface DesignInfo {
  designDate: string;
  implantLibrary?: string;
  teethLibrary?: string;
  actionsTaken?: string;
}

export interface ClinicalInfo {
  insertionDate: string;
  applianceFit?: string;
  designFeedback?: string;
  occlusion?: string;
  esthetics?: string;
  adjustmentsMade?: string;
  material?: string;
  shade?: string;
}

export interface LabScript {
  id: string;
  requestNumber?: string;
  patientId?: string;
  patient_id?: string; // Add this to support both formats
  patientFirstName?: string;
  patientLastName?: string;
  doctorName: string;
  clinicName: string;
  requestDate: string;
  dueDate: string;
  status: LabScriptStatus;
  upperTreatment?: string;
  lowerTreatment?: string;
  upperDesignName?: string;
  lowerDesignName?: string;
  applianceType?: string;
  screwType?: string;
  vdoOption?: string;
  specificInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
  designInfo?: DesignInfo;
  clinicalInfo?: ClinicalInfo;
  fileUploads?: Record<string, File>;
  treatments?: {
    upper: string[];
    lower: string[];
  };
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
  created_at?: string;
  updated_at?: string;
}

export const mapDatabaseLabScript = (dbScript: DatabaseLabScript): LabScript => {
  return {
    id: dbScript.id,
    requestNumber: dbScript.request_number,
    patientId: dbScript.patient_id,
    patient_id: dbScript.patient_id, // Map both formats
    doctorName: dbScript.doctor_name,
    clinicName: dbScript.clinic_name,
    requestDate: dbScript.request_date,
    dueDate: dbScript.due_date,
    status: dbScript.status as LabScriptStatus,
    upperTreatment: dbScript.upper_treatment,
    lowerTreatment: dbScript.lower_treatment,
    upperDesignName: dbScript.upper_design_name,
    lowerDesignName: dbScript.lower_design_name,
    applianceType: dbScript.appliance_type,
    screwType: dbScript.screw_type,
    vdoOption: dbScript.vdo_option,
    specificInstructions: dbScript.specific_instructions,
    createdAt: dbScript.created_at,
    updatedAt: dbScript.updated_at
  };
};

export const mapLabScriptToDatabase = (script: LabScript): DatabaseLabScript => {
  return {
    id: script.id,
    request_number: script.requestNumber,
    patient_id: script.patientId || script.patient_id, // Use either format
    doctor_name: script.doctorName,
    clinic_name: script.clinicName,
    request_date: script.requestDate,
    due_date: script.dueDate,
    status: script.status,
    upper_treatment: script.upperTreatment,
    lower_treatment: script.lowerTreatment,
    upper_design_name: script.upperDesignName,
    lower_design_name: script.lowerDesignName,
    appliance_type: script.applianceType,
    screw_type: script.screwType,
    vdo_option: script.vdoOption,
    specific_instructions: script.specificInstructions,
    created_at: script.createdAt,
    updated_at: script.updatedAt
  };
};