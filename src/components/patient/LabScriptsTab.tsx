import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptList } from "./LabScriptList";
import { LabScriptDetails } from "./LabScriptDetails";

export type LabScript = {
  id: string;
  doctorName: string;
  clinicName: string;
  requestDate: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  treatments: {
    upper: string[];
    lower: string[];
  };
  specificInstructions?: string;
  applianceType?: string;
};

type LabScriptsTabProps = {
  labScripts: LabScript[];
  onEditScript?: (scriptId: string) => void;
};

export const LabScriptsTab = ({ labScripts, onEditScript }: LabScriptsTabProps) => {
  console.log("Rendering LabScriptsTab with scripts:", labScripts);
  const [selectedScript, setSelectedScript] = React.useState<LabScript | null>(null);

  const handleRowClick = (script: LabScript) => {
    console.log("Row clicked, script:", script);
    setSelectedScript(script);
  };

  const handleEditClick = (e: React.MouseEvent, scriptId: string) => {
    e.stopPropagation();
    onEditScript?.(scriptId);
  };

  return (
    <>
      <ScrollArea className="h-[500px]">
        <LabScriptList 
          labScripts={labScripts}
          onRowClick={handleRowClick}
          onEditClick={handleEditClick}
        />
      </ScrollArea>

      <LabScriptDetails
        script={selectedScript}
        open={!!selectedScript}
        onOpenChange={(open) => !open && setSelectedScript(null)}
        onEdit={(scriptId) => {
          onEditScript?.(scriptId);
          setSelectedScript(null);
        }}
      />
    </>
  );
};