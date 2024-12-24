import { LabScript } from "@/components/patient/LabScriptsTab";

const generateRequestNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `LAB-${timestamp}-${random}`;
};

export const clearLabScripts = (): void => {
  localStorage.removeItem('labScripts');
  console.log("All lab scripts cleared from storage");
};

export const saveLabScript = (script: LabScript): boolean => {
  console.log("Attempting to save lab script:", script);
  const existingScripts = getLabScripts();
  
  // Check for duplicates based on request number or matching patient and date
  const isDuplicate = existingScripts.some(existing => 
    existing.requestNumber === script.requestNumber ||
    (existing.patientFirstName === script.patientFirstName &&
     existing.patientLastName === script.patientLastName &&
     existing.requestDate === script.requestDate &&
     existing.id !== script.id)
  );
  
  if (isDuplicate) {
    console.log("Duplicate script detected - Not saving");
    return false;
  }
  
  // Ensure script has a unique request number
  const scriptToSave = {
    ...script,
    requestNumber: script.requestNumber || generateRequestNumber(),
    id: script.id || Date.now().toString()
  };

  const updatedScripts = [...existingScripts, scriptToSave];
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script saved successfully");
  return true;
};

export const updateLabScript = (updatedScript: LabScript): void => {
  console.log("Updating lab script:", updatedScript);
  const existingScripts = getLabScripts();
  
  // Remove old version and add updated version
  const filteredScripts = existingScripts.filter(script => script.id !== updatedScript.id);
  const updatedScripts = [...filteredScripts, updatedScript];
  
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script updated successfully");
};

export const getLabScripts = (): LabScript[] => {
  try {
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    
    // Create a Map to ensure uniqueness by ID
    const uniqueScripts = new Map<string, LabScript>();
    
    // Process scripts in reverse chronological order and ensure uniqueness
    scripts
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
      .forEach(script => {
        // Only add if we don't already have a script with this ID
        if (script.id && !uniqueScripts.has(script.id)) {
          uniqueScripts.set(script.id, {
            ...script,
            // Ensure request number exists
            requestNumber: script.requestNumber || generateRequestNumber()
          });
        }
      });
    
    const result = Array.from(uniqueScripts.values());
    console.log("Retrieved unique lab scripts:", result.length);
    return result;
  } catch (error) {
    console.error("Error loading scripts:", error);
    return [];
  }
};

// Clean up any existing duplicates in storage
const cleanupStorage = () => {
  const uniqueScripts = getLabScripts();
  localStorage.setItem('labScripts', JSON.stringify(uniqueScripts));
  console.log("Storage cleaned up, removed duplicates");
};

// Run cleanup on module load
cleanupStorage();