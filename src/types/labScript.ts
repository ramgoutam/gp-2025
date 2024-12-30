import { Database } from "@/integrations/supabase/types";
import { ManufacturingLog } from "./manufacturing";

export interface LabScript {
  id: string;
  requestNumber?: string;
  patientId?: string;
  doctorName: string;
  clinicName: string;
  requestDate: string;
  dueDate: string;
  status: string;
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
  manufacturingLog?: ManufacturingLog | null;
}

export const mapDatabaseLabScript = (data: any): LabScript => {
  return {
    id: data.id,
    requestNumber: data.request_number,
    patientId: data.patient_id,
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
    manufacturingLog: data.manufacturing_logs?.[0] || null
  };
};