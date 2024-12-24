import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScriptTitle } from "./ScriptTitle";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { ProgressTracking } from "./ProgressTracking";
import { LabScript } from "@/types/labScript";
import { InfoStatus } from "@/types/reportCard";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type ReportCardData = {
  id: string;
  lab_script_id: string;
  patient_id: string;
  design_info_id: string | null;
  clinical_info_id: string | null;
  design_info_status: InfoStatus;
  clinical_info_status: InfoStatus;
  design_info?: Record<string, any>;
  clinical_info?: Record<string, any>;
};

export const ReportCard = ({
  script,
  onDesignInfo,
  onClinicalInfo,
  onUpdateScript,
}: {
  script: {
    id: string;
    requestNumber?: string;
    status: string;
    requestDate: string;
    designInfo?: Record<string, any>;
    clinicalInfo?: Record<string, any>;
  };
  onDesignInfo: (script: { id: string }) => void;
  onClinicalInfo: () => void;
  onUpdateScript?: (script: { id: string }) => void;
}) => {
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
        setDesignInfoStatus(reportCard.design_info_status);
        setClinicalInfoStatus(reportCard.clinical_info_status);
        setIsCompleted(script.status === 'completed');
      }
    } catch (error) {
      console.error("Error in fetchReportCardStatus:", error);
    }
  };

  useEffect(() => {
    fetchReportCardStatus();

    // Subscribe to report card changes
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
          if (payload.new && 'design_info_status' in payload.new) {
            setDesignInfoStatus(payload.new.design_info_status);
            setClinicalInfoStatus(payload.new.clinical_info_status);
            fetchReportCardStatus(); // Refresh the entire report card data
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
      onUpdateScript({ ...script, status: 'completed' });
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