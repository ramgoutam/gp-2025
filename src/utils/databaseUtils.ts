import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Patient = Database['public']['Tables']['patients']['Row'];
type PatientInsert = Database['public']['Tables']['patients']['Insert'];
type LabScript = Database['public']['Tables']['lab_scripts']['Row'];
type LabScriptInsert = Database['public']['Tables']['lab_scripts']['Insert'];

export const generateRequestNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `LAB-${timestamp}-${random}`;
};

export const createPatient = async (patient: PatientInsert): Promise<Patient> => {
  console.log('Creating patient:', patient);
  const { data, error } = await supabase
    .from('patients')
    .insert([patient])
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

export const saveLabScript = async (script: LabScriptInsert): Promise<LabScript> => {
  console.log('Saving lab script:', script);
  const { data, error } = await supabase
    .from('lab_scripts')
    .insert([{
      ...script,
      request_number: generateRequestNumber(),
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving lab script:', error);
    throw error;
  }

  return data;
};

export const updateLabScript = async (script: Partial<LabScript> & { id: string }): Promise<LabScript> => {
  console.log('Updating lab script:', script);
  const { data, error } = await supabase
    .from('lab_scripts')
    .update(script)
    .eq('id', script.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lab script:', error);
    throw error;
  }

  return data;
};

export const deleteLabScript = async (id: string): Promise<void> => {
  console.log('Deleting lab script:', id);
  const { error } = await supabase
    .from('lab_scripts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lab script:', error);
    throw error;
  }
};

export const getLabScripts = async (): Promise<LabScript[]> => {
  console.log('Fetching lab scripts');
  const { data, error } = await supabase
    .from('lab_scripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lab scripts:', error);
    throw error;
  }

  return data || [];
};