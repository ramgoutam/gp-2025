import { supabase } from "@/integrations/supabase/client";
import { LabScript, DatabaseLabScript, mapDatabaseLabScript, mapLabScriptToDatabase } from "@/types/labScript";

export const getLabScripts = async (): Promise<LabScript[]> => {
  console.log("Fetching lab scripts from database");
  const { data: scripts, error } = await supabase
    .from('lab_scripts')
    .select('*');

  if (error) {
    console.error("Error fetching lab scripts:", error);
    throw error;
  }

  return scripts.map(mapDatabaseLabScript);
};

export const saveLabScript = async (script: Partial<LabScript>): Promise<LabScript> => {
  console.log("Saving lab script to database:", script);
  
  // Add default values for required fields if not provided
  const scriptWithDefaults = {
    doctor_name: "Default Doctor", // You might want to get this from a context or user session
    clinic_name: "Default Clinic", // You might want to get this from a context or user session
    ...script
  };
  
  // Remove id and type-cast other fields
  const { id, ...scriptWithoutId } = scriptWithDefaults as any;
  const dbScript = mapLabScriptToDatabase(scriptWithoutId as LabScript);
  
  const { data, error } = await supabase
    .from('lab_scripts')
    .insert([dbScript])
    .select()
    .single();

  if (error) {
    console.error("Error saving lab script:", error);
    throw error;
  }

  return mapDatabaseLabScript(data);
};

export const updateLabScript = async (script: LabScript): Promise<LabScript> => {
  console.log("Updating lab script in database:", script);
  const dbScript = mapLabScriptToDatabase(script);
  
  const { data, error } = await supabase
    .from('lab_scripts')
    .update(dbScript)
    .eq('id', script.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating lab script:", error);
    throw error;
  }

  return mapDatabaseLabScript(data);
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