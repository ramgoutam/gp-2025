import React from "react";
import { Card } from "@/components/ui/card";
import { ActionButtons } from "./ActionButtons";
import { ScriptTitle } from "./ScriptTitle";
import { StatusBadge } from "./StatusBadge";
import { ProgressTracking } from "./ProgressTracking";
import { LabScript } from "@/types/labScript";

interface ReportCardProps {
  script: LabScript;
  onDesignInfo: (script: LabScript) => void;
  onClinicalInfo: (script: LabScript) => void;
  onUpdateScript?: (script: LabScript) => void;
}

export const ReportCard = ({
  script,
  onDesignInfo,
  onClinicalInfo,
  onUpdateScript,
}: ReportCardProps) => {
  console.log("Rendering report card with script:", script);

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
          onClinicalInfo={() => onClinicalInfo(script)}
          onComplete={handleComplete}
          designInfoStatus={script.designInfo ? 'completed' : 'pending'}
          clinicalInfoStatus={script.clinicalInfo ? 'completed' : 'pending'}
        />
      </div>

      <ProgressTracking 
        script={script}
        designInfoStatus={script.designInfo ? 'completed' : 'pending'}
        clinicalInfoStatus={script.clinicalInfo ? 'completed' : 'pending'}
      />
    </Card>
  );
};