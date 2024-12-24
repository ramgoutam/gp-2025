import React from "react";
import { LabScriptsTab } from "@/components/patient/LabScriptsTab";
import { useToast } from "@/components/ui/use-toast";
import { LabScript } from "@/types/labScript";

interface LabScriptsContentProps {
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
  onDeleteLabScript: (script: LabScript) => void;
  patientData?: {
    firstName: string;
    lastName: string;
  };
}

export const LabScriptsContent = ({
  labScripts,
  onCreateLabScript,
  onEditLabScript,
  onDeleteLabScript,
  patientData,
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

  const handleDeleteLabScript = (script: LabScript) => {
    console.log("Handling lab script delete in LabScriptsContent:", script);
    onDeleteLabScript(script);
    
    toast({
      title: "Lab Script Deleted",
      description: "The lab script has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-4">
      <LabScriptsTab 
        labScripts={labScripts} 
        onCreateLabScript={handleCreateLabScript}
        onEditLabScript={handleEditLabScript}
        onDeleteLabScript={handleDeleteLabScript}
        patientData={patientData}
      />
    </div>
  );
};
