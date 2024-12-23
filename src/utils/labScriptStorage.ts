import { LabScript } from "@/components/patient/LabScriptsTab";

// Generate a unique request number with prefix LAB
const generateRequestNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `LAB-${timestamp}-${random}`;
};

export const saveLabScript = (script: LabScript): boolean => {
  console.log("Attempting to save lab script:", script);
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
  // Add request number if not present
  const scriptToSave = {
    ...script,
    requestNumber: script.requestNumber || generateRequestNumber()
  };
  
  // Create a Map to ensure uniqueness by ID
  const scriptsMap = new Map<string, LabScript>();
  
  // Add existing scripts to map (except the one we're updating)
  existingScripts.forEach(existing => {
    if (existing.id !== scriptToSave.id) {
      scriptsMap.set(existing.id, existing);
    }
  });
  
  // Add new script
  scriptsMap.set(scriptToSave.id, scriptToSave);
  
  // Convert map back to array and save
  const updatedScripts = Array.from(scriptsMap.values());
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script saved successfully. Updated scripts:", updatedScripts);
  return true;
};

export const updateLabScript = (updatedScript: LabScript): void => {
  console.log("Updating lab script:", updatedScript);
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
  // Create a Map to ensure uniqueness
  const scriptsMap = new Map<string, LabScript>();
  
  // Add all scripts to map, replacing the updated one
  existingScripts.forEach(script => {
    if (script.id === updatedScript.id) {
      scriptsMap.set(script.id, updatedScript);
    } else {
      scriptsMap.set(script.id, script);
    }
  });
  
  const updatedScripts = Array.from(scriptsMap.values());
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script updated successfully. Updated scripts:", updatedScripts);
};

export const getLabScripts = (): LabScript[] => {
  try {
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    
    // Create a Map to ensure uniqueness by ID
    const scriptsMap = new Map<string, LabScript>();
    
    scripts.forEach(script => {
      if (script.id) {
        scriptsMap.set(script.id, script);
      }
    });
    
    const uniqueScripts = Array.from(scriptsMap.values());
    console.log("Retrieved unique scripts:", uniqueScripts);
    return uniqueScripts;
  } catch (error) {
    console.error("Error loading scripts:", error);
    return [];
  }
};