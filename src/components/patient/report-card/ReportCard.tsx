import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScriptTitle } from "./ScriptTitle";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { ProgressTracking } from "./ProgressTracking";
import { LabScript } from "@/types/labScript";
import { InfoStatus, ReportCardData } from "@/types/reportCard";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

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

  const fetchReportCardStatus = async () => {
    try {
      console.log("Fetching report card status for script:", script.id);
      const { data: reportCard, error } = await supabase
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
        return;
      }

      if (reportCard) {
        console.log("Found report card:", reportCard);
        setDesignInfoStatus(reportCard.design_info_status as InfoStatus);
        setClinicalInfoStatus(reportCard.clinical_info_status as InfoStatus);
        setIsCompleted(reportCard.status === 'completed');
      }
    } catch (error) {
      console.error("Error in fetchReportCardStatus:", error);
    }
  };

  useEffect(() => {
    fetchReportCardStatus();

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
          if (payload.new) {
            const newData = payload.new as ReportCardData;
            setDesignInfoStatus(newData.design_info_status);
            setClinicalInfoStatus(newData.clinical_info_status);
            setIsCompleted(newData.status === 'completed');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [script.id]);

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

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <ScriptTitle script={script} />
          <StatusBadge status={script.status} />
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
    </Card>
  );
};