import { DesignInfo, ClinicalInfo } from './reportCard';
import { ManufacturingLog } from './manufacturing';

export interface LabScript {
  id: string;
  requestNumber?: string;
  patientId?: string;
  doctorName: string;
  clinicName: string;
  requestDate: string;
  dueDate: string;
  status: string;
  designInfo: DesignInfo;
  clinicalInfo: ClinicalInfo;
  designInfoStatus: string;
  clinicalInfoStatus: string;
  patientFirstName: string;
  patientLastName: string;
  manufacturingLogs?: ManufacturingLog[];
}

export interface ManufacturingData {
  counts: {
    inhousePrinting: number;
    inhouseMilling: number;
    outsourcePrinting: number;
    outsourceMilling: number;
    inhouseMiyo: number;
    total: number;
  };
  scripts: LabScript[];
}