import React from "react";
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
    onEditLabScript(updatedScript);
    
    toast({
      title: "Lab Script Updated",
      description: "The lab script has been successfully updated.",
    });
  };

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