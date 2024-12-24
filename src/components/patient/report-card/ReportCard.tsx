import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ActionButtons } from "./ActionButtons";
import { ScriptTitle } from "./ScriptTitle";
import { StatusBadge } from "./StatusBadge";
import { ProgressTracking } from "./ProgressTracking";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { InfoStatus } from "@/types/reportCard";

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

  useEffect(() => {
    const fetchReportCardStatus = async () => {
      console.log("Fetching report card status for script:", script.id);
      try {
        const { data: reportCard, error } = await supabase
          .from('report_cards')
          .select(`
            design_info_status,
            clinical_info_status,
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
        }
      } catch (error) {
        console.error("Error in fetchReportCardStatus:", error);
      }
    };

    fetchReportCardStatus();
  }, [script.id]);

  const handleComplete = () => {
    if (onUpdateScript) {
      const updatedScript = {
        ...script,
        status: 'completed' as const
      };
      onUpdateScript(updatedScript);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <ScriptTitle script={script} />
          <StatusBadge status={script.status} />
        </div>
        <ActionButtons
          script={script}
          onDesignInfo={() => onDesignInfo(script)}
          onClinicalInfo={onClinicalInfo}
          onComplete={handleComplete}
          designInfoStatus={designInfoStatus}
          clinicalInfoStatus={clinicalInfoStatus}
        />
      </div>

      <ProgressTracking 
        script={script}
        designInfoStatus={designInfoStatus}
        clinicalInfoStatus={clinicalInfoStatus}
      />
    </Card>
  );
};