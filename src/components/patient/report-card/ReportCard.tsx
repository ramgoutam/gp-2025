import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScriptTitle } from "./ScriptTitle";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { ProgressTracking } from "./ProgressTracking";
import { LabScript } from "@/types/labScript";
import { InfoStatus } from "@/types/reportCard";
import { supabase } from "@/integrations/supabase/client";

interface ReportCardProps {
  script: LabScript;
  onDesignInfo: (script: LabScript) => void;
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
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'report_cards',
          filter: `lab_script_id=eq.${script.id}`
        },
        (payload) => {
          console.log("Report card updated, payload:", payload);
          if (payload.new) {
            setDesignInfoStatus(payload.new.design_info_status as InfoStatus);
            setClinicalInfoStatus(payload.new.clinical_info_status as InfoStatus);
          }
        }
      )
      .subscribe();

    // Subscribe to lab script changes
    const scriptChannel = supabase
      .channel('lab-script-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_scripts',
          filter: `id=eq.${script.id}`
        },
        (payload) => {
          console.log("Lab script updated, payload:", payload);
          if (payload.new) {
            setIsCompleted(payload.new.status === 'completed');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(scriptChannel);
    };
  }, [script.id]);

  const handleComplete = async () => {
    if (onUpdateScript) {
      const updatedScript = {
        ...script,
        status: 'completed' as const
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