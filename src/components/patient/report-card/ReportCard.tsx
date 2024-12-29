import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScriptTitle } from "./ScriptTitle";
import { ActionButtons } from "./ActionButtons";
import { ProgressTracking } from "./ProgressTracking";
import { LabScript } from "@/types/labScript";
import { InfoStatus } from "@/types/reportCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ReportCardDialog } from "./ReportCardDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ReportCardProps {
  script: LabScript;
  onDesignInfo: (script: { id: string }) => void;
  onClinicalInfo: () => void;
  onUpdateScript?: (script: LabScript) => void;
  patientName?: string;
}

export const ReportCard = ({
  script,
  onDesignInfo,
  onClinicalInfo,
  onUpdateScript,
  patientName,
}: ReportCardProps) => {
  const [designInfoStatus, setDesignInfoStatus] = useState<InfoStatus>("pending");
  const [clinicalInfoStatus, setClinicalInfoStatus] = useState<InfoStatus>("pending");
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reportCard } = useQuery({
    queryKey: ['reportCard', script.id],
    queryFn: async () => {
      console.log("Fetching report card status for script:", script.id);
      const { data, error } = await supabase
        .from('report_cards')
        .select(`
          *,
          design_info:design_info_id(*),
          clinical_info:clinical_info_id(*)
        `)
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching report card:", error);
        return null;
      }

      console.log("Found report card:", data);
      return data;
    },
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (reportCard) {
      setDesignInfoStatus(reportCard.design_info_status as InfoStatus);
      setClinicalInfoStatus(reportCard.clinical_info_status as InfoStatus);
      setIsCompleted(reportCard.status === 'completed');
    }
  }, [reportCard]);

  useEffect(() => {
    const channel = supabase
      .channel('report-card-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'report_cards',
          filter: `lab_script_id=eq.${script.id}`
        },
        (payload: RealtimePostgresChangesPayload<ReportCardData>) => {
          console.log("Report card updated, payload:", payload);
          queryClient.invalidateQueries({ queryKey: ['reportCard', script.id] });
          
          // Type guard to ensure payload.new exists and has the correct type
          if (payload.new && 'design_info_status' in payload.new && payload.new.design_info_status === 'completed') {
            console.log("Design info marked as completed, invalidating reports query");
            queryClient.invalidateQueries({ queryKey: ['reports'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [script.id, queryClient]);

  const handleComplete = async () => {
    console.log("Completing report card");
    try {
      const { error: updateError } = await supabase
        .from('report_cards')
        .update({ status: 'completed' })
        .eq('lab_script_id', script.id);

      if (updateError) {
        throw updateError;
      }

      setIsCompleted(true);
      
      toast({
        title: "Success",
        description: "Report card has been completed successfully.",
      });

      // Invalidate queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    } catch (error) {
      console.error("Error completing report card:", error);
      toast({
        title: "Error",
        description: "Failed to complete report card. Please try again.",
        variant: "destructive"
      });
    }
  };

  const [showReportDialog, setShowReportDialog] = useState(false);

  const handleViewReport = () => {
    console.log("Opening report dialog for script:", script.id);
    setShowReportDialog(true);
  };

  return (
    <>
      <Card className="p-3 space-y-3 relative bg-white hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <ScriptTitle script={script} patientName={patientName} />
          </div>
          <div className="flex-shrink-0">
            <ActionButtons
              script={script}
              onDesignInfo={onDesignInfo}
              onClinicalInfo={onClinicalInfo}
              onComplete={handleComplete}
              designInfoStatus={designInfoStatus}
              clinicalInfoStatus={clinicalInfoStatus}
              isCompleted={isCompleted}
            />
          </div>
        </div>

        <ProgressTracking
          script={script}
          designInfoStatus={designInfoStatus}
          clinicalInfoStatus={clinicalInfoStatus}
          isCompleted={isCompleted}
        />

        {isCompleted && (
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewReport}
              className="rounded-full hover:bg-primary/5 w-8 h-8"
            >
              <FileText className="h-5 w-5 text-primary" />
            </Button>
          </div>
        )}
      </Card>

      <ReportCardDialog 
        open={showReportDialog} 
        onOpenChange={setShowReportDialog}
        script={script}
      />
    </>
  );
};
