import { supabase } from "@/integrations/supabase/client";
import { LabScript, DatabaseLabScript, mapDatabaseLabScript, mapLabScriptToDatabase } from "@/types/labScript";

export const getLabScripts = async (): Promise<LabScript[]> => {
  console.log("Fetching lab scripts from database");
  const { data: scripts, error } = await supabase
    .from('lab_scripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching lab scripts:", error);
    throw error;
  }

  console.log("Retrieved lab scripts:", scripts);
  return scripts.map(mapDatabaseLabScript);
};

export const saveLabScript = async (script: Partial<LabScript>): Promise<LabScript> => {
  console.log("Saving lab script to database:", script);
  
  // Create a new object with only the fields that match our database schema
  const dbScript = {
    patient_id: script.patientId,
    doctor_name: script.doctorName || "Default Doctor",
    clinic_name: script.clinicName || "Default Clinic",
    request_date: script.requestDate,
    due_date: script.dueDate,
    status: script.status || "pending",
    upper_treatment: script.upperTreatment,
    lower_treatment: script.lowerTreatment,
    upper_design_name: script.upperDesignName,
    lower_design_name: script.lowerDesignName,
    appliance_type: script.applianceType,
    screw_type: script.screwType,
    vdo_option: script.vdoOption,
    specific_instructions: script.specificInstructions
  };
  
  console.log("Mapped database script:", dbScript);
  
  const { data, error } = await supabase
    .from('lab_scripts')
    .insert([dbScript])
    .select()
    .single();

  if (error) {
    console.error("Error saving lab script:", error);
    throw error;
  }

  console.log("Successfully saved lab script:", data);
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

  console.log("Successfully updated lab script:", data);
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
