import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScriptTitle } from "./ScriptTitle";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { ProgressTracking } from "./ProgressTracking";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { InfoStatus } from "@/types/reportCard";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type ReportCardData = {
  id: string;
  lab_script_id: string | null;
  patient_id: string;
  design_info_id: string | null;
  clinical_info_id: string | null;
  design_info_status: InfoStatus;
  clinical_info_status: InfoStatus;
  created_at: string;
  updated_at: string;
};

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

  const fetchReportCardStatus = async () => {
    console.log("Fetching report card status for script:", script.id);
    try {
      const { data: reportCard, error } = await supabase
        .from('report_cards')
        .select(`
          *,
          design_info(*),
          clinical_info(*)
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
        setIsCompleted(script.status === 'completed');
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
          if (payload.new && 'design_info_status' in payload.new && 'clinical_info_status' in payload.new) {
            setDesignInfoStatus(payload.new.design_info_status);
            setClinicalInfoStatus(payload.new.clinical_info_status);
            fetchReportCardStatus();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [script.id]);

  const handleComplete = async () => {
    if (onUpdateScript) {
      const updatedScript: LabScript = {
        ...script,
        status: 'completed' as LabScriptStatus
      };
      onUpdateScript(updatedScript);
      setIsCompleted(true);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <ScriptTitle script={script} />
          <StatusBadge status={script.status} />
        </div>
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

      <ProgressTracking
        script={script}
        designInfoStatus={designInfoStatus}
        clinicalInfoStatus={clinicalInfoStatus}
        isCompleted={isCompleted}
      />
    </Card>
  );
};