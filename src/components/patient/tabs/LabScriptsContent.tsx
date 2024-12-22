import React, { useEffect } from "react";
import { LabScriptsTab } from "@/components/patient/LabScriptsTab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LabScript } from "@/components/patient/LabScriptsTab";
import { useToast } from "@/components/ui/use-toast";

interface LabScriptsContentProps {
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
}

export const LabScriptsContent = ({
  labScripts,
  onCreateLabScript,
  onEditLabScript,
}: LabScriptsContentProps) => {
  const { toast } = useToast();

  const handleCreateLabScript = () => {
    console.log("Creating new lab script in LabScriptsContent");
    onCreateLabScript();
  };

  const handleEditLabScript = (updatedScript: LabScript) => {
    console.log("Handling lab script edit in LabScriptsContent:", updatedScript);
    
    // Update localStorage
    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
    const updatedScripts = existingScripts.map((script: LabScript) => 
      script.id === updatedScript.id ? updatedScript : script
    );
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    
    // Notify parent component
    onEditLabScript(updatedScript);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('labScriptsUpdated'));
    
    toast({
      title: "Lab Script Updated",
      description: "The lab script has been successfully updated.",
    });
  };

  // Listen for lab scripts updates
  useEffect(() => {
    const handleLabScriptsUpdate = () => {
      console.log("Lab scripts updated event received in LabScriptsContent");
      const savedScripts = localStorage.getItem('labScripts');
      if (savedScripts) {
        try {
          const scripts = JSON.parse(savedScripts);
          console.log("Updated lab scripts:", scripts);
          scripts.forEach((script: LabScript) => {
            onEditLabScript(script);
          });
        } catch (error) {
          console.error("Error parsing lab scripts:", error);
        }
      }
    };

    window.addEventListener('labScriptsUpdated', handleLabScriptsUpdate);
    return () => {
      window.removeEventListener('labScriptsUpdated', handleLabScriptsUpdate);
    };
  }, [onEditLabScript]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreateLabScript} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Lab Script
        </Button>
      </div>
      <LabScriptsTab 
        labScripts={labScripts} 
        onCreateLabScript={handleCreateLabScript}
        onEditLabScript={handleEditLabScript}
      />
    </div>
  );
};