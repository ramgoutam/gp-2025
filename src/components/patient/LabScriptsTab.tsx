import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptDetails } from "./LabScriptDetails";
import { LabScriptCard } from "./lab-script-details/LabScriptCard";
import { EmptyState } from "./report-card/EmptyState";
import { LabScriptHeader } from "./lab-script-details/LabScriptHeader";
import { ProgressBar } from "./ProgressBar";
import { updateLabScript } from "@/utils/databaseUtils";
import { LabScript } from "@/types/labScript";

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

  // Sort lab scripts by request date in descending order (newest first)
  const sortedLabScripts = React.useMemo(() => {
    console.log("Sorting lab scripts by date...");
    return [...labScripts].sort((a, b) => {
      const dateA = new Date(a.request_date).getTime();
      const dateB = new Date(b.request_date).getTime();
      console.log(`Comparing dates: ${a.request_date} vs ${b.request_date}`);
      return dateB - dateA; // Descending order
    });
  }, [labScripts]);

  console.log("Sorted lab scripts:", sortedLabScripts);

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

  const handleStatusChange = async (script: LabScript, newStatus: LabScript['status']) => {
    console.log("Handling status change:", script.id, newStatus);
    const updatedScript = { ...script, status: newStatus };
    onEditLabScript(updatedScript);
    await updateLabScript(updatedScript);
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

  return (
    <div className="flex flex-col h-full space-y-6 max-w-[1200px] mx-auto">
      <LabScriptHeader 
        patientName={patientName}
        onCreateLabScript={onCreateLabScript}
      />

      {selectedScript && <ProgressBar steps={progressSteps} />}

      <div className="flex-1 min-h-0 bg-white rounded-lg border border-gray-100 shadow-sm">
        <ScrollArea className="h-[calc(100vh-500px)] px-6 py-4">
          <div className="space-y-4 pr-4 pb-8">
            {sortedLabScripts.length === 0 ? (
              <EmptyState />
            ) : (
              sortedLabScripts.map((script) => (
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
      </div>

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