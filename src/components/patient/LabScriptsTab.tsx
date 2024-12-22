import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
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
};

export const LabScriptsTab = ({ labScripts }: LabScriptsTabProps) => {
  console.log("Rendering LabScriptsTab with scripts:", labScripts);
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);
  const navigate = useNavigate();
  
  const handleRowClick = (script: LabScript) => {
    console.log("Row clicked, script:", script);
    setSelectedScript(script);
  };

  const handleEditClick = (e: React.MouseEvent, scriptId: string) => {
    e.stopPropagation();
    navigate(`/scripts/${scriptId}/edit`);
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
          navigate(`/scripts/${scriptId}/edit`);
          setSelectedScript(null);
        }}
      />
    </>
  );
};