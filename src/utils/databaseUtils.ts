import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Patient = Database['public']['Tables']['patients']['Row'];
type PatientInsert = Database['public']['Tables']['patients']['Insert'];

export const createPatient = async (patientData: PatientInsert): Promise<Patient | null> => {
  console.log('Creating patient:', patientData);
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single();

  if (error) {
    console.error('Error creating patient:', error);
    throw error;
  }

  return data;
};

export const getPatients = async (): Promise<Patient[]> => {
  console.log('Fetching all patients');
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }

  return data || [];
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  console.log('Fetching patient by id:', id);
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }

  return data;
};