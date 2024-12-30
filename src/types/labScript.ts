import type { ClinicalInfo } from "./clinicalInfo";
import type { DesignInfo } from "./designInfo";
import type { ManufacturingLog } from "./manufacturing";
import type { ReportCard, InfoStatus } from "./reportCard";

export type LabScriptStatus = 
  | "pending"
  | "processing"
  | "in_progress"
  | "paused"
  | "hold"
  | "completed";

export interface LabScript {
  id: string;
  requestNumber?: string;
  patientId?: string;
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
  createdAt: string;
  updatedAt: string;
  manufacturingSource?: string;
  manufacturingType?: string;
  material?: string;
  shade?: string;
  designLink?: string;
  holdReason?: string;
  designInfo?: DesignInfo;
  clinicalInfo?: ClinicalInfo;
  fileUploads?: Record<string, File[]>;
  manufacturingLog?: ManufacturingLog;
  reportCard?: ReportCard;
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
  status: LabScriptStatus;
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
  design_link?: string;
  hold_reason?: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
  manufacturing_logs?: ManufacturingLog[];
  report_cards?: ReportCard[];
}

export const mapDatabaseLabScript = (data: DatabaseLabScript): LabScript => {
  return {
    id: data.id,
    requestNumber: data.request_number,
    patientId: data.patient_id,
    patientFirstName: data.patient?.first_name,
    patientLastName: data.patient?.last_name,
    doctorName: data.doctor_name,
    clinicName: data.clinic_name,
    requestDate: data.request_date,
    dueDate: data.due_date,
    status: data.status,
    upperTreatment: data.upper_treatment,
    lowerTreatment: data.lower_treatment,
    upperDesignName: data.upper_design_name,
    lowerDesignName: data.lower_design_name,
    applianceType: data.appliance_type,
    screwType: data.screw_type,
    vdoOption: data.vdo_option,
    specificInstructions: data.specific_instructions,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    manufacturingSource: data.manufacturing_source,
    manufacturingType: data.manufacturing_type,
    material: data.material,
    shade: data.shade,
    designLink: data.design_link,
    holdReason: data.hold_reason,
    manufacturingLog: data.manufacturing_logs?.[0],
    reportCard: data.report_cards?.[0],
    treatments: {
      upper: data.upper_treatment ? [data.upper_treatment] : [],
      lower: data.lower_treatment ? [data.lower_treatment] : []
    }
  };
};

export const mapLabScriptToDatabase = (script: LabScript): Partial<DatabaseLabScript> => {
  return {
    request_number: script.requestNumber,
    patient_id: script.patientId,
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
    manufacturing_source: script.manufacturingSource,
    manufacturing_type: script.manufacturingType,
    material: script.material,
    shade: script.shade,
    design_link: script.designLink,
    hold_reason: script.holdReason,
    created_at: script.createdAt,
    updated_at: script.updatedAt
  };
};