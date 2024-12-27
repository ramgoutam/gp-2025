export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
  address?: string;
  treatment_type?: string;
  upper_treatment?: string;
  lower_treatment?: string;
  surgery_date?: string;
  emergency_phone?: string;
  emergency_contact_name?: string;
  labScripts?: any[];
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