import { LabScript } from "@/components/patient/LabScriptsTab";

const generateRequestNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `LAB-${timestamp}-${random}`;
};

const createScriptKey = (script: LabScript): string => {
  return `${script.patientFirstName}-${script.patientLastName}-${script.doctorName}-${script.clinicName}-${script.requestDate}-${script.dueDate}`;
};

export const clearLabScripts = (): void => {
  localStorage.removeItem('labScripts');
  console.log("All lab scripts cleared from storage");
};

export const saveLabScript = (script: LabScript): boolean => {
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
  const scriptToSave = {
    ...script,
    requestNumber: script.requestNumber || generateRequestNumber()
  };

  const newScriptKey = createScriptKey(scriptToSave);
  
  // Check for duplicates using the composite key
  const existingScript = existingScripts.find((existing: LabScript) => 
    createScriptKey(existing) === newScriptKey
  );

  if (existingScript) {
    console.log("Duplicate script detected - Not saving");
    return false;
  }

  const newScripts = [...existingScripts, scriptToSave];
  localStorage.setItem('labScripts', JSON.stringify(newScripts));
  return true;
};

export const updateLabScript = (updatedScript: LabScript): void => {
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
  // Remove old version by ID and add updated version
  const updatedScripts = [
    ...existingScripts.filter((script: LabScript) => script.id !== updatedScript.id),
    updatedScript
  ];
  
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
};

export const getLabScripts = (): LabScript[] => {
  try {
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    
    // Use Map to ensure uniqueness by ID (keeping most recent version)
    const uniqueScripts = new Map<string, LabScript>();
    
    // Sort by timestamp (newest first) and ensure uniqueness
    return scripts
      .sort((a, b) => parseInt(b.id || '0') - parseInt(a.id || '0'))
      .filter(script => {
        const key = script.id;
        if (!uniqueScripts.has(key)) {
          uniqueScripts.set(key, script);
          return true;
        }
        return false;
      });
  } catch (error) {
    console.error("Error loading scripts:", error);
    return [];
  }
};

// Clear all lab scripts on load
clearLabScripts();