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
  upperTreatment: string;
  lowerTreatment: string;
  treatments: {
    upper: string[];
    lower: string[];
  };
  specificInstructions?: string;
  applianceType?: string;
  fileUploads?: Record<string, File[]>;
};

type LabScriptsTabProps = {
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
};

export const LabScriptsTab = ({ labScripts, onCreateLabScript, onEditLabScript }: LabScriptsTabProps) => {
  const [selectedScript, setSelectedScript] = React.useState<LabScript | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleRowClick = (script: LabScript) => {
    console.log("Row clicked, script:", script);
    setSelectedScript(script);
    setIsEditing(false);
  };

  const handleEditClick = (script: LabScript) => {
    console.log("Edit clicked, script:", script);
    setSelectedScript(script);
    setIsEditing(true);
  };

  const handleScriptEdit = (updatedScript: LabScript) => {
    console.log("Handling script edit in LabScriptsTab:", updatedScript);
    onEditLabScript(updatedScript);
    setSelectedScript(null);
    setIsEditing(false);
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
        onOpenChange={(open) => {
          if (!open) {
            setSelectedScript(null);
            setIsEditing(false);
          }
        }}
        onEdit={handleScriptEdit}
        isEditing={isEditing}
      />
    </>
  );
};