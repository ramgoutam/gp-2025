import { LabScript } from "./labScript";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
  address?: string;
  treatmentType?: string;
  upperTreatment?: string;
  lowerTreatment?: string;
  surgeryDate?: string;
  emergencyContactName?: string;
  emergencyPhone?: string;
  labScripts?: LabScript[];
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyPhone: string;
  sex: string;
  dob: string;
  address: string;
}