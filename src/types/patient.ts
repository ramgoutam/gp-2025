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

export interface PatientUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_phone?: string;
  sex?: string;
  dob?: string;
  address?: string;
  treatment_type?: string;
  upper_treatment?: string;
  lower_treatment?: string;
  surgery_date?: string;
}