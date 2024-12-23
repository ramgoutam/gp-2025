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
  
  // Check for exact duplicates
  const isDuplicate = existingScripts.some((existing: LabScript) => {
    const isExactMatch = 
      existing.patientFirstName === scriptToSave.patientFirstName &&
      existing.patientLastName === scriptToSave.patientLastName &&
      existing.requestDate === scriptToSave.requestDate &&
      existing.dueDate === scriptToSave.dueDate &&
      existing.doctorName === scriptToSave.doctorName &&
      existing.clinicName === scriptToSave.clinicName;

    // Log the comparison details for debugging
    if (isExactMatch) {
      console.log("Found potential duplicate:", {
        existing,
        new: scriptToSave,
        matchDetails: {
          patientName: existing.patientFirstName === scriptToSave.patientFirstName,
          requestDate: existing.requestDate === scriptToSave.requestDate,
          dueDate: existing.dueDate === scriptToSave.dueDate,
          doctorName: existing.doctorName === scriptToSave.doctorName,
          clinicName: existing.clinicName === scriptToSave.clinicName
        }
      });
    }

    return isExactMatch;
  });

  if (isDuplicate) {
    console.error("Duplicate script detected:", scriptToSave);
    return false;
  }

  // Save the new script
  const newScripts = [...existingScripts, scriptToSave];
  localStorage.setItem('labScripts', JSON.stringify(newScripts));
  console.log("Lab script saved successfully. Total scripts:", newScripts.length);
  return true;
};

export const updateLabScript = (updatedScript: LabScript): void => {
  console.log("Updating lab script:", updatedScript);
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
  // Remove the script being updated and add the new version
  const updatedScripts = existingScripts
    .filter((script: LabScript) => script.id !== updatedScript.id)
    .concat(updatedScript);
  
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script updated successfully. Total scripts:", updatedScripts.length);
};

export const getLabScripts = (): LabScript[] => {
  try {
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    
    // Create a Map to ensure uniqueness by ID
    const uniqueScripts = new Map<string, LabScript>();
    
    // Sort scripts by timestamp (newest first)
    const sortedScripts = [...scripts].sort((a, b) => {
      const aTime = parseInt(a.id || '0');
      const bTime = parseInt(b.id || '0');
      return bTime - aTime;
    });
    
    // Only keep unique scripts based on multiple criteria
    sortedScripts.forEach(script => {
      if (!uniqueScripts.has(script.id)) {
        uniqueScripts.set(script.id, script);
      }
    });
    
    const result = Array.from(uniqueScripts.values());
    console.log("Retrieved scripts. Total count:", result.length);
    return result;
  } catch (error) {
    console.error("Error loading scripts:", error);
    return [];
  }
};