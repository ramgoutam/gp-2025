export interface Patient {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  treatment_type?: string;
  upper_treatment?: string;
  lower_treatment?: string;
  surgery_date?: string;
  emergency_phone?: string;
  emergency_contact_name?: string;
}

export type PatientUpdateData = Partial<Patient>;