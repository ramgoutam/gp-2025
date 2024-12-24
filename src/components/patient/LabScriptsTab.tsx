import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptDetails } from "./LabScriptDetails";
import { LabScriptCard } from "./lab-script-details/LabScriptCard";
import { EmptyState } from "./report-card/EmptyState";
import { LabScriptHeader } from "./lab-script-details/LabScriptHeader";
import { ProgressBar } from "./ProgressBar";
import { updateLabScript } from "@/utils/databaseUtils";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [scriptDetails, setScriptDetails] = React.useState<Record<string, any>>({});

  // Sort lab scripts by request date in descending order (newest first)
  const sortedLabScripts = React.useMemo(() => {
    console.log("Sorting lab scripts by date...");
    return [...labScripts].sort((a, b) => {
      const dateA = new Date(a.requestDate).getTime();
      const dateB = new Date(b.requestDate).getTime();
      console.log(`Comparing dates: ${a.requestDate} vs ${b.requestDate}`);
      return dateB - dateA; // Descending order
    });
  }, [labScripts]);

  // Preload all script details when the component mounts or lab scripts change
  React.useEffect(() => {
    const fetchScriptDetails = async () => {
      try {
        for (const script of sortedLabScripts) {
          console.log("Preloading details for script:", script.id);
          
          const { data: reportCard, error: reportCardError } = await supabase
            .from('report_cards')
            .select('*, design_info(*), clinical_info(*)')
            .eq('lab_script_id', script.id)
            .maybeSingle();

          if (reportCardError) {
            console.error("Error fetching report card:", reportCardError);
            continue;
          }

          if (reportCard) {
            setScriptDetails(prev => ({
              ...prev,
              [script.id]: {
                reportCard,
                designInfo: reportCard.design_info,
                clinicalInfo: reportCard.clinical_info
              }
            }));
          }
        }
      } catch (error) {
        console.error("Error preloading script details:", error);
        toast({
          title: "Error",
          description: "Failed to load some script details",
          variant: "destructive"
        });
      }
    };

    fetchScriptDetails();
  }, [sortedLabScripts]);

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
                  script={{
                    ...script,
                    designInfo: scriptDetails[script.id]?.designInfo,
                    clinicalInfo: scriptDetails[script.id]?.clinicalInfo
                  }}
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
        script={selectedScript ? {
          ...selectedScript,
          designInfo: scriptDetails[selectedScript.id]?.designInfo,
          clinicalInfo: scriptDetails[selectedScript.id]?.clinicalInfo
        } : null}
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