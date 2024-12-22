import React from "react";
import { LabScriptsTab } from "@/components/patient/LabScriptsTab";

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
      <LabScriptsTab labScripts={labScripts} onEditScript={onEditLabScript} />
    </div>
  );
};