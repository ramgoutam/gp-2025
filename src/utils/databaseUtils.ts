import { supabase } from '@/lib/supabase';

// Patient operations
export const createPatient = async (patientData: any) => {
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

export const getPatients = async () => {
  console.log('Fetching all patients');
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }

  return data;
};

export const getPatientById = async (id: string) => {
  console.log('Fetching patient by id:', id);
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }

  return data;
};

// Lab Script operations
export const createLabScript = async (labScriptData: any) => {
  console.log('Creating lab script:', labScriptData);
  const { data, error } = await supabase
    .from('lab_scripts')
    .insert([labScriptData])
    .select()
    .single();

  if (error) {
    console.error('Error creating lab script:', error);
    throw error;
  }

  return data;
};

export const getLabScripts = async (patientId?: string) => {
  console.log('Fetching lab scripts', patientId ? `for patient ${patientId}` : 'for all patients');
  let query = supabase
    .from('lab_scripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (patientId) {
    query = query.eq('patient_id', patientId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching lab scripts:', error);
    throw error;
  }

  return data;
};

export const updateLabScript = async (id: string, updates: any) => {
  console.log('Updating lab script:', id, updates);
  const { data, error } = await supabase
    .from('lab_scripts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lab script:', error);
    throw error;
  }

  return data;
};

// Report Card operations
export const createReportCard = async (reportCardData: any) => {
  console.log('Creating report card:', reportCardData);
  const { data, error } = await supabase
    .from('report_cards')
    .insert([reportCardData])
    .select()
    .single();

  if (error) {
    console.error('Error creating report card:', error);
    throw error;
  }

  return data;
};

export const getReportCards = async (labScriptId?: string) => {
  console.log('Fetching report cards', labScriptId ? `for lab script ${labScriptId}` : 'for all lab scripts');
  let query = supabase
    .from('report_cards')
    .select('*')
    .order('created_at', { ascending: false });

  if (labScriptId) {
    query = query.eq('lab_script_id', labScriptId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching report cards:', error);
    throw error;
  }

  return data;
};

export const updateReportCard = async (id: string, updates: any) => {
  console.log('Updating report card:', id, updates);
  const { data, error } = await supabase
    .from('report_cards')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating report card:', error);
    throw error;
  }

  return data;
};