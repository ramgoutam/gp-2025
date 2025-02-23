import { supabase } from "@/integrations/supabase/client";
import { LabScript, DatabaseLabScript, mapDatabaseLabScript, mapLabScriptToDatabase } from "@/types/labScript";

export const getLabScripts = async (): Promise<LabScript[]> => {
  console.log("Fetching lab scripts from database");
  const { data: scripts, error } = await supabase
    .from('lab_scripts')
    .select(`
      id,
      request_number,
      patient_id,
      doctor_name,
      clinic_name,
      request_date,
      due_date,
      status,
      upper_treatment,
      lower_treatment,
      upper_design_name,
      lower_design_name,
      appliance_type,
      screw_type,
      vdo_option,
      specific_instructions,
      created_at,
      updated_at,
      manufacturing_source,
      manufacturing_type,
      material,
      shade
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
  console.log("Saving lab script to database:", script);
  
  if (!script.patientId) {
    console.error("Cannot create lab script without patient ID");
    throw new Error("Patient ID is required to create a lab script");
  }

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
    specific_instructions: script.specificInstructions,
    manufacturing_source: script.manufacturingSource,
    manufacturing_type: script.manufacturingType,
    material: script.material,
    shade: script.shade
  };
  
  console.log("Mapped database script:", dbScript);
  
  const { data, error } = await supabase
    .from('lab_scripts')
    .insert([dbScript])
    .select()
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