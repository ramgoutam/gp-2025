import React from "react";
import { LabScript } from "../LabScriptsTab";
import { ReportCard } from "../report-card/ReportCard";

interface ReportCardContentProps {
  patientData?: {
    firstName: string;
    lastName: string;
  };
  labScripts?: LabScript[];
}

export const ReportCardContent = ({ patientData, labScripts = [] }: ReportCardContentProps) => {
  console.log("ReportCardContent rendered with scripts:", labScripts);

  const handleDesignInfo = (script: LabScript) => {
    console.log("Opening design info for script:", script.id);
  };

  const handleClinicalInfo = (script: LabScript) => {
    console.log("Opening clinical info for script:", script.id);
  };

  const handleUpdateScript = (updatedScript: LabScript) => {
    console.log("Updating script in ReportCardContent:", updatedScript);
  };

  return (
    <div className="space-y-6">
      <ReportCard
        patientData={patientData}
        labScripts={labScripts}
        onDesignInfo={handleDesignInfo}
        onClinicalInfo={handleClinicalInfo}
        onUpdateScript={handleUpdateScript}
      />
    </div>
  );
};