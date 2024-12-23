import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabReportForm } from "../lab-report/LabReportForm";
import { LabScript } from "../LabScriptsTab";
import { DesignInfoForm } from "../forms/DesignInfoForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportCardHeader } from "../report-card/ReportCardHeader";
import { ReportCard } from "../report-card/ReportCard";
import { EmptyState } from "../report-card/EmptyState";

interface ReportCardContentProps {
  patientData?: {
    firstName: string;
    lastName: string;
  };
  labScripts?: LabScript[];
}

export const ReportCardContent = ({ patientData, labScripts = [] }: ReportCardContentProps) => {
  const { toast } = useToast();
  const [showDesignInfo, setShowDesignInfo] = React.useState(false);
  const [showClinicalInfo, setShowClinicalInfo] = React.useState(false);
  const [selectedScript, setSelectedScript] = React.useState<LabScript | null>(null);
  const [localLabScripts, setLocalLabScripts] = React.useState<LabScript[]>(labScripts);

  React.useEffect(() => {
    setLocalLabScripts(labScripts);
  }, [labScripts]);

  const handleDesignInfo = (script: LabScript) => {
    console.log("Opening design info for script:", script.id);
    setSelectedScript(script);
    setShowDesignInfo(true);
  };

  const handleClinicalInfo = (script: LabScript) => {
    console.log("Opening clinical info for script:", script.id);
    setSelectedScript(script);
    setShowClinicalInfo(true);
    toast({
      title: "Clinical Info",
      description: "Clinical information feature coming soon.",
    });
  };

  const handleUpdateScript = (updatedScript: LabScript) => {
    console.log("Updating script in ReportCardContent:", updatedScript);
    setLocalLabScripts(prevScripts =>
      prevScripts.map(script =>
        script.id === updatedScript.id ? updatedScript : script
      )
    );
  };

  return (
    <div className="space-y-6">
      <ReportCard
        patientData={patientData}
        labScripts={localLabScripts}
        onDesignInfo={handleDesignInfo}
        onClinicalInfo={handleClinicalInfo}
        onUpdateScript={handleUpdateScript}
      />
    </div>
  );
};