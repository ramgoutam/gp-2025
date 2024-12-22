import React from "react";
import { LabScriptsTab } from "@/components/patient/LabScriptsTab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LabScript } from "@/components/patient/LabScriptsTab";

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
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onCreateLabScript} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Lab Script
        </Button>
      </div>
      <LabScriptsTab 
        labScripts={labScripts} 
        onCreateLabScript={onCreateLabScript}
        onEditLabScript={onEditLabScript}
      />
    </div>
  );
};