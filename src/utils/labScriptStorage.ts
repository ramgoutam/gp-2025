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
  
  // Check for duplicates by request number
  const isDuplicate = existingScripts.some((existing: LabScript) => 
    existing.requestNumber === scriptToSave.requestNumber
  );

  if (isDuplicate) {
    console.error("Duplicate script detected:", scriptToSave);
    return false;
  }

  const newScripts = [...existingScripts, scriptToSave];
  localStorage.setItem('labScripts', JSON.stringify(newScripts));
  console.log("Lab script saved successfully:", scriptToSave);
  return true;
};

export const updateLabScript = (updatedScript: LabScript): void => {
  console.log("Updating lab script:", updatedScript);
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
  // Ensure we're not creating duplicates during update
  const updatedScripts = existingScripts.map((script: LabScript) => 
    script.id === updatedScript.id ? updatedScript : script
  );
  
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script updated successfully");
};

export const getLabScripts = (): LabScript[] => {
  try {
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    // Create a Map to ensure uniqueness by request number
    const uniqueScripts = new Map<string, LabScript>();
    
    scripts.forEach(script => {
      if (script.requestNumber) {
        uniqueScripts.set(script.requestNumber, script);
      }
    });
    
    return Array.from(uniqueScripts.values());
  } catch (error) {
    console.error("Error loading scripts:", error);
    return [];
  }
};