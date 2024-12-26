import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptDetails } from "./LabScriptDetails";
import { LabScriptCard } from "./lab-script-details/LabScriptCard";
import { EmptyState } from "./report-card/EmptyState";
import { LabScriptHeader } from "./lab-script-details/LabScriptHeader";
import { ProgressBar } from "./ProgressBar";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  labScripts: initialLabScripts, 
  onCreateLabScript, 
  onEditLabScript,
  onDeleteLabScript,
  patientData 
}: LabScriptsTabProps) => {
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for enriched lab scripts with real-time updates
  const { data: enrichedLabScripts = [] } = useQuery({
    queryKey: ['enrichedLabScripts', initialLabScripts],
    queryFn: async () => {
      try {
        console.log("Enriching lab scripts data");
        const enrichedScripts = await Promise.all(
          initialLabScripts.map(async (script) => {
            const { data: reportCardData, error: reportCardError } = await supabase
              .from('report_cards')
              .select(`
                *,
                design_info:design_info_id(*),
                clinical_info:clinical_info_id(*)
              `)
              .eq('lab_script_id', script.id)
              .maybeSingle();

            if (reportCardError) {
              console.error("Error fetching report card:", reportCardError);
              return script;
            }

            return {
              ...script,
              designInfo: reportCardData?.design_info,
              clinicalInfo: reportCardData?.clinical_info,
              reportCard: reportCardData ? {
                ...reportCardData,
                design_info: undefined,
                clinical_info: undefined
              } : undefined
            };
          })
        );

        return enrichedScripts.sort((a, b) => {
          return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
        });
      } catch (error) {
        console.error("Error enriching lab scripts:", error);
        toast({
          title: "Error",
          description: "Failed to load some script details",
          variant: "destructive"
        });
        return initialLabScripts;
      }
    },
    refetchInterval: 1, // Updated to 1ms for real-time updates
  });

  // Set up real-time subscription for lab script status updates
  useEffect(() => {
    const channel = supabase
      .channel('lab-scripts-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lab_scripts',
          filter: `id=in.(${initialLabScripts.map(s => `'${s.id}'`).join(',')})`
        },
        (payload) => {
          console.log("Lab script updated:", payload);
          // Update the specific script in the cache
          queryClient.setQueryData(['enrichedLabScripts', initialLabScripts], (old: any) => {
            if (!old) return old;
            return old.map((script: LabScript) => 
              script.id === payload.new.id ? { ...script, ...payload.new } : script
            );
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialLabScripts, queryClient]);

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
    console.log("Handling script edit:", updatedScript);
    onEditLabScript(updatedScript);
    setSelectedScript(null);
    setIsEditing(false);
  };

  const handleStatusChange = (script: LabScript, newStatus: LabScript['status']) => {
    console.log("Status changed for script:", script.id, newStatus);
    // The UI will be updated through the real-time subscription
  };

  const patientName = patientData 
    ? `${patientData.firstName} ${patientData.lastName}`
    : "Patient";

  const progressSteps = [
    { label: "Request Created", status: "completed" as const },
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