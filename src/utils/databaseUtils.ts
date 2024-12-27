import { supabase } from "@/integrations/supabase/client";
import { LabScript, DatabaseLabScript, mapDatabaseLabScript, mapLabScriptToDatabase } from "@/types/labScript";

export const getLabScripts = async (): Promise<LabScript[]> => {
  console.log("Fetching lab scripts from database");
  const { data: scripts, error } = await supabase
    .from('lab_scripts')
    .select(`
      *,
      patient:patients(first_name, last_name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching lab scripts:", error);
    throw error;
  }

  console.log("Retrieved lab scripts:", scripts);
  return scripts.map(script => mapDatabaseLabScript(script as DatabaseLabScript));
};

export const saveLabScript = async (script: Partial<LabScript>): Promise<LabScript> => {
  console.log("Saving new lab script to database:", script);
  
  if (!script.patientId) {
    console.error("Cannot create lab script without patient ID");
    throw new Error("Patient ID is required to create a lab script");
  }

  const dbScript = mapLabScriptToDatabase(script as LabScript);
  console.log("Mapped database script for insert:", dbScript);

  // Create a properly typed object with required fields
  const insertData = {
    patient_id: dbScript.patient_id,
    clinic_name: dbScript.clinic_name || 'Default Clinic', // Provide default or throw error if needed
    doctor_name: dbScript.doctor_name || 'Default Doctor', // Provide default or throw error if needed
    request_date: dbScript.request_date || new Date().toISOString().split('T')[0],
    due_date: dbScript.due_date || new Date().toISOString().split('T')[0],
    status: dbScript.status || 'pending',
    ...dbScript // Spread the rest of the optional fields
  };

  console.log("Inserting lab script with data:", insertData);

  const { data, error } = await supabase
    .from('lab_scripts')
    .insert([insertData])
    .select(`
      *,
      patient:patients(first_name, last_name)
    `)
    .single();

  if (error) {
    console.error("Error saving lab script:", error);
    throw new Error(`Failed to save lab script: ${error.message}`);
  }

  if (!data) {
    throw new Error("No data returned after saving lab script");
  }

  console.log("Successfully saved lab script:", data);
  return mapDatabaseLabScript(data as DatabaseLabScript);
};

export const updateLabScript = async (script: LabScript): Promise<LabScript> => {
  console.log("Updating lab script in database. Script ID:", script.id);
  console.log("Update payload:", script);

  if (!script.id) {
    throw new Error("Cannot update lab script without ID");
  }

  const dbScript = mapLabScriptToDatabase(script);
  console.log("Mapped database script for update:", dbScript);
  
  const { data, error } = await supabase
    .from('lab_scripts')
    .update(dbScript)
    .eq('id', script.id)
    .select(`
      *,
      patient:patients(first_name, last_name)
    `)
    .single();

  if (error) {
    console.error("Error updating lab script:", error);
    throw error;
  }

  if (!data) {
    throw new Error("No data returned after updating lab script");
  }

  console.log("Successfully updated lab script:", data);
  return mapDatabaseLabScript(data as DatabaseLabScript);
};

export const deleteLabScript = async (id: string): Promise<void> => {
  console.log("Deleting lab script from database:", id);
  const { error } = await supabase
    .from('lab_scripts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting lab script:", error);
    throw error;
  }
};

export const getPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*');

  if (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }

  return data;
};

export const createPatient = async (patientData: any) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single();

  if (error) {
    console.error("Error creating patient:", error);
    throw error;
  }

  return data;
};