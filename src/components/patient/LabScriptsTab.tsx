import React, { useState, useEffect } from "react";
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
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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
  const [enrichedLabScripts, setEnrichedLabScripts] = useState<LabScript[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const enrichLabScripts = async () => {
      try {
        setIsLoading(true);
        const enrichedScripts = await Promise.all(
          labScripts.map(async (script) => {
            console.log("Fetching report card data for script:", script.id);
            
            const { data: reportCardData, error: reportCardError } = await supabase
              .from('report_cards')
              .select(`
                *,
                design_info:design_info_id(
                  id, design_date, appliance_type, upper_treatment, 
                  lower_treatment, screw, implant_library, teeth_library, 
                  actions_taken, report_card_id, created_at, updated_at
                ),
                clinical_info:clinical_info_id(
                  id, insertion_date, appliance_fit, design_feedback, 
                  occlusion, esthetics, adjustments_made, material, 
                  shade, report_card_id, created_at, updated_at
                )
              `)
              .eq('lab_script_id', script.id)
              .maybeSingle();

            if (reportCardError) {
              console.error("Error fetching report card:", reportCardError);
              return script;
            }

            if (reportCardData) {
              return {
                ...script,
                designInfo: reportCardData.design_info,
                clinicalInfo: reportCardData.clinical_info,
                reportCard: {
                  ...reportCardData,
                  design_info: undefined,
                  clinical_info: undefined
                }
              };
            }

            return script;
          })
        );

        const sortedScripts = enrichedScripts.sort((a, b) => {
          const dateA = new Date(a.requestDate).getTime();
          const dateB = new Date(b.requestDate).getTime();
          return dateB - dateA;
        });

        console.log("Sorted report card scripts:", sortedScripts);
        setEnrichedLabScripts(sortedScripts);
      } catch (error) {
        console.error("Error enriching lab scripts:", error);
        toast({
          title: "Error",
          description: "Failed to load some script details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    enrichLabScripts();

    // Set up real-time subscription for report cards
    const channel = supabase
      .channel('report-cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'report_cards'
        },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          console.log("Report card changed:", payload);
          
          // Re-fetch the updated report card data
          if (payload.new && payload.new.lab_script_id) {
            const { data: updatedReportCard, error } = await supabase
              .from('report_cards')
              .select(`
                *,
                design_info:design_info_id(*),
                clinical_info:clinical_info_id(*)
              `)
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error("Error fetching updated report card:", error);
              return;
            }

            // Update the enriched lab scripts with new data
            setEnrichedLabScripts(prevScripts =>
              prevScripts.map(script => {
                if (script.id === updatedReportCard.lab_script_id) {
                  return {
                    ...script,
                    designInfo: updatedReportCard.design_info,
                    clinicalInfo: updatedReportCard.clinical_info,
                    reportCard: {
                      ...updatedReportCard,
                      design_info: undefined,
                      clinical_info: undefined
                    }
                  };
                }
                return script;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [labScripts]);

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
            {enrichedLabScripts.length === 0 ? (
              <EmptyState />
            ) : (
              enrichedLabScripts.map((script) => (
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