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
  
  const scriptToSave = {
    ...script,
    requestNumber: script.requestNumber || generateRequestNumber()
  };
  
  // Check for duplicates by both ID and request number
  const isDuplicate = existingScripts.some((existing: LabScript) => 
    existing.id === scriptToSave.id || 
    existing.requestNumber === scriptToSave.requestNumber ||
    (existing.patientFirstName === scriptToSave.patientFirstName &&
     existing.patientLastName === scriptToSave.patientLastName &&
     existing.requestDate === scriptToSave.requestDate &&
     existing.dueDate === scriptToSave.dueDate &&
     existing.doctorName === scriptToSave.doctorName)
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
  
  // Remove any potential duplicates and update the script
  const updatedScripts = existingScripts
    .filter((script: LabScript) => script.id !== updatedScript.id)
    .concat(updatedScript);
  
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script updated successfully. Updated scripts:", updatedScripts);
};

export const getLabScripts = (): LabScript[] => {
  try {
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    
    // Create a Map to ensure uniqueness by both ID and request number
    const uniqueScripts = new Map<string, LabScript>();
    
    // Sort scripts by timestamp (newest first) to keep the most recent versions
    const sortedScripts = [...scripts].sort((a, b) => {
      const aTime = parseInt(a.id || '0');
      const bTime = parseInt(b.id || '0');
      return bTime - aTime;
    });
    
    // Only keep unique scripts based on multiple criteria
    sortedScripts.forEach(script => {
      const key = `${script.patientFirstName}-${script.patientLastName}-${script.requestDate}-${script.dueDate}-${script.doctorName}`;
      if (!uniqueScripts.has(key)) {
        uniqueScripts.set(key, script);
      }
    });
    
    const result = Array.from(uniqueScripts.values());
    console.log("Retrieved unique scripts:", result);
    return result;
  } catch (error) {
    console.error("Error loading scripts:", error);
    return [];
  }
};
