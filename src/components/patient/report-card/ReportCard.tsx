import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScriptTitle } from "./ScriptTitle";
import { ActionButtons } from "./ActionButtons";
import { ProgressTracking } from "./ProgressTracking";
import { LabScript } from "@/types/labScript";
import { InfoStatus, ReportCardData } from "@/types/reportCard";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
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
}

export const ReportCard = ({
  script,
  onDesignInfo,
  onClinicalInfo,
  onUpdateScript,
}: ReportCardProps) => {
  const [designInfoStatus, setDesignInfoStatus] = useState<InfoStatus>("pending");
  const [clinicalInfoStatus, setClinicalInfoStatus] = useState<InfoStatus>("pending");
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for report card status with 1 second refresh instead of millisecond
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
    refetchInterval: 1000, // Changed from 1 to 1000 (1 second)
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
      <Card className="p-6 space-y-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <ScriptTitle script={script} />
          </div>
          <div className="flex gap-3">
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
          <div className="absolute bottom-6 right-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewReport}
              className="rounded-full hover:bg-primary/5 w-12 h-12"
            >
              <FileText className="h-8 w-8 text-primary" />
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
