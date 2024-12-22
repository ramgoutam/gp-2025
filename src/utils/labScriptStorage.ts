import { LabScript } from "@/components/patient/LabScriptsTab";

export const saveLabScript = (script: LabScript): boolean => {
  console.log("Attempting to save lab script:", script);
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
  
  // Check for duplicates by ID and patient details
  const isDuplicate = existingScripts.some((existing: LabScript) => 
    existing.id === script.id || 
    (existing.patientFirstName === script.patientFirstName && 
     existing.patientLastName === script.patientLastName &&
     existing.requestDate === script.requestDate &&
     existing.dueDate === script.dueDate)
  );

  if (isDuplicate) {
    console.error("Duplicate script detected:", script);
    return false;
  }

  const newScripts = [...existingScripts, script];
  localStorage.setItem('labScripts', JSON.stringify(newScripts));
  console.log("Lab script saved successfully:", script);
  return true;
};

export const updateLabScript = (updatedScript: LabScript): void => {
  console.log("Updating lab script:", updatedScript);
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
  const updatedScripts = existingScripts.map((script: LabScript) => 
    script.id === updatedScript.id ? updatedScript : script
  );
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
};