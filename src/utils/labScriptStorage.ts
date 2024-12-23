import { LabScript } from "@/components/patient/LabScriptsTab";

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

  // Create a unique key for comparison
  const createKey = (s: LabScript) => 
    `${s.patientFirstName}-${s.patientLastName}-${s.doctorName}-${s.clinicName}-${s.requestDate}-${s.dueDate}`;
  
  const newScriptKey = createKey(scriptToSave);
  
  // Check for duplicates using the composite key
  const isDuplicate = existingScripts.some((existing: LabScript) => {
    const existingKey = createKey(existing);
    const duplicate = existingKey === newScriptKey;
    
    if (duplicate) {
      console.log("Duplicate detected - Comparing:", {
        existing: existingKey,
        new: newScriptKey,
        existingScript: existing,
        newScript: scriptToSave
      });
    }
    
    return duplicate;
  });

  if (isDuplicate) {
    console.error("Duplicate script detected - Not saving:", scriptToSave);
    return false;
  }

  // Save new script
  const newScripts = [...existingScripts, scriptToSave];
  localStorage.setItem('labScripts', JSON.stringify(newScripts));
  console.log("Lab script saved successfully. New total:", newScripts.length);
  return true;
};

export const updateLabScript = (updatedScript: LabScript): void => {
  console.log("Updating lab script:", updatedScript);
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
  // Remove old version and add updated version
  const updatedScripts = existingScripts
    .filter((script: LabScript) => script.id !== updatedScript.id)
    .concat(updatedScript);
  
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script updated. New total:", updatedScripts.length);
};

export const getLabScripts = (): LabScript[] => {
  try {
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    
    // Use Map to ensure uniqueness by composite key
    const uniqueScripts = new Map<string, LabScript>();
    
    // Sort by timestamp (newest first)
    const sortedScripts = [...scripts].sort((a, b) => {
      const aTime = parseInt(a.id || '0');
      const bTime = parseInt(b.id || '0');
      return bTime - aTime;
    });
    
    // Keep only unique scripts using composite key
    sortedScripts.forEach(script => {
      const key = `${script.patientFirstName}-${script.patientLastName}-${script.doctorName}-${script.clinicName}-${script.requestDate}-${script.dueDate}`;
      if (!uniqueScripts.has(key)) {
        uniqueScripts.set(key, script);
      }
    });
    
    const result = Array.from(uniqueScripts.values());
    console.log("Retrieved unique scripts. Total:", result.length);
    return result;
  } catch (error) {
    console.error("Error loading scripts:", error);
    return [];
  }
};
