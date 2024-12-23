import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptDetails } from "./LabScriptDetails";
import { LabScriptCard } from "./lab-script-details/LabScriptCard";
import { EmptyState } from "./report-card/EmptyState";
import { LabScriptHeader } from "./lab-script-details/LabScriptHeader";
import { ProgressBar } from "./ProgressBar";
import { updateLabScript } from "@/utils/labScriptStorage";

export type LabScript = {
  id: string;
  requestNumber?: string;
  patientFirstName: string;
  patientLastName: string;
  doctorName: string;
  clinicName: string;
  requestDate: string;
  dueDate: string;
  status: "pending" | "processing" | "in_progress" | "paused" | "hold" | "completed";
  upperTreatment: string;
  lowerTreatment: string;
  upperDesignName?: string;
  lowerDesignName?: string;
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
  clinicalInfo?: {
    insertionDate: string;
    applianceFit: string;
    designFeedback: string;
    occlusion: string;
    esthetics: string;
    adjustmentsMade: string;
    material: string;
    shade: string;
  };
};

type LabScriptsTabProps = {
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
  onDeleteLabScript: (script: LabScript) => void;
  patientData?: {
    firstName: string;
    lastName: string;
  };
};

export const LabScriptsTab = ({ 
  labScripts, 
  onCreateLabScript, 
  onEditLabScript,
  onDeleteLabScript,
  patientData 
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

  const handleStatusChange = (script: LabScript, newStatus: LabScript['status']) => {
    console.log("Handling status change:", script.id, newStatus);
    const updatedScript = { ...script, status: newStatus };
    onEditLabScript(updatedScript);
    updateLabScript(updatedScript);
  };

  const patientName = patientData 
    ? `${patientData.firstName} ${patientData.lastName}`
    : "Patient";

  const progressSteps = [
    { 
      label: "Request Created", 
      status: "completed" as const 
    },
    { 
      label: "Design Info", 
      status: selectedScript?.designInfo ? "completed" as const : "current" as const 
    },
    { 
      label: "Clinical Info", 
      status: selectedScript?.clinicalInfo 
        ? "completed" as const 
        : selectedScript?.designInfo 
          ? "current" as const 
          : "upcoming" as const 
    },
    { 
      label: "Completed", 
      status: selectedScript?.status === 'completed' 
        ? "completed" as const 
        : "upcoming" as const 
    }
  ];

  console.log("Progress steps being passed to ProgressBar:", progressSteps);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <LabScriptHeader 
        patientName={patientName}
        onCreateLabScript={onCreateLabScript}
      />

      {selectedScript && <ProgressBar steps={progressSteps} />}

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
                onDelete={() => onDeleteLabScript(script)}
                onStatusChange={handleStatusChange}
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
    </div>
  );
};
