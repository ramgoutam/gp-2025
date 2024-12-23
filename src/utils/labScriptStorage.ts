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
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
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
  const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
  
  // Remove old version by ID and add updated version
  const updatedScripts = [
    ...existingScripts.filter((script: LabScript) => script.id !== updatedScript.id),
    updatedScript
  ];
  
  localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
  console.log("Lab script updated successfully");
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

// Clear all scripts immediately
clearLabScripts();