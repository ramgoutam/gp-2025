import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptDetails } from "./LabScriptDetails";
import { LabScriptCard } from "./lab-script-details/LabScriptCard";
import { EmptyState } from "./report-card/EmptyState";

export type LabScript = {
  id: string;
  requestNumber?: string;
  patientFirstName: string;
  patientLastName: string;
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
  vdoOption?: string;
  screwType?: string;
  firstName?: string;
  lastName?: string;
  notes?: string;
  designInfo?: {
    designDate: string;
    implantLibrary: string;
    teethLibrary: string;
    actionsTaken: string;
  };
};

type LabScriptsTabProps = {
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
  onDeleteLabScript: (script: LabScript) => void;
};

export const LabScriptsTab = ({ 
  labScripts, 
  onCreateLabScript, 
  onEditLabScript,
  onDeleteLabScript 
}: LabScriptsTabProps) => {
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

  const handleDeleteClick = (script: LabScript) => {
    console.log("Delete clicked, script:", script);
    onDeleteLabScript(script);
  };

  return (
    <>
      <ScrollArea className="h-[500px] px-4">
        <div className="space-y-4">
          {labScripts.length === 0 ? (
            <EmptyState />
          ) : (
            labScripts.map((script) => (
              <LabScriptCard
                key={script.id}
                script={script}
                onClick={() => handleRowClick(script)}
                onEdit={() => handleEditClick(script)}
                onDelete={() => handleDeleteClick(script)}
              />
            ))
          )}
        </div>
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