import { LabScript } from "@/components/patient/LabScriptsTab";

const generateRequestNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `LAB-${timestamp}-${random}`;
};

const hasDesignNameConflict = (newScript: LabScript, existingScripts: LabScript[]): boolean => {
  return existingScripts.some(existingScript => {
    // Only check if the design names match
    const upperNameConflict = newScript.upperDesignName && 
      newScript.upperDesignName === existingScript.upperDesignName;
    const lowerNameConflict = newScript.lowerDesignName && 
      newScript.lowerDesignName === existingScript.lowerDesignName;
    
    return upperNameConflict || lowerNameConflict;
  });
};

export const clearLabScripts = (): void => {
  localStorage.removeItem('labScripts');
  console.log("All lab scripts cleared from storage");
};

export const saveLabScript = (script: LabScript): boolean => {
  console.log("Saving lab script:", script);
  const existingScripts = getLabScripts();
  
  // Check if script with same ID already exists
  const isDuplicate = existingScripts.some(existing => existing.id === script.id);
  if (isDuplicate) {
    console.log("Duplicate script ID detected - Not saving");
    return false;
  }
  
  const scriptToSave = {
    ...script,
    requestNumber: script.requestNumber || generateRequestNumber()
  };

  // Check for duplicate design names
  if (hasDesignNameConflict(scriptToSave, existingScripts)) {
    console.log("Duplicate design name detected - Not saving");
    return false;
  }

  const newScripts = [...existingScripts, scriptToSave];
  localStorage.setItem('labScripts', JSON.stringify(newScripts));
  console.log("Lab script saved successfully");
  return true;
};

export const updateLabScript = (updatedScript: LabScript): void => {
  console.log("Updating lab script:", updatedScript);
  const existingScripts = getLabScripts();
  
  // Remove duplicates and old version by ID
  const filteredScripts = existingScripts.filter(script => script.id !== updatedScript.id);
  
  // Add the updated version
  const updatedScripts = [...filteredScripts, updatedScript];
  
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script updated successfully");
};

export const getLabScripts = (): LabScript[] => {
  try {
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    
    // Create a Map to ensure uniqueness by ID
    const uniqueScripts = new Map<string, LabScript>();
    
    // Process scripts in reverse chronological order
    scripts
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
      .forEach(script => {
        if (script.id && !uniqueScripts.has(script.id)) {
          uniqueScripts.set(script.id, script);
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

// Clear duplicates from existing storage
const cleanupStorage = () => {
  const uniqueScripts = getLabScripts();
  localStorage.setItem('labScripts', JSON.stringify(uniqueScripts));
  console.log("Storage cleaned up, removed duplicates");
};

// Run cleanup on module load
cleanupStorage();