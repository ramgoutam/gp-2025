import React from "react";
import { LabScriptsTab } from "@/components/patient/LabScriptsTab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const LabScriptsContent = ({
  labScripts,
  onCreateLabScript,
  onEditLabScript,
}: {
  labScripts: any[];
  onCreateLabScript: () => void;
  onEditLabScript: (scriptId: string) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onCreateLabScript} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Lab Script
        </Button>
      </div>
      <LabScriptsTab labScripts={labScripts} onEditScript={onEditLabScript} />
    </div>
  );
};