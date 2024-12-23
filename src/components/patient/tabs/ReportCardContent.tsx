import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabReportForm } from "../lab-report/LabReportForm";
import { LabScript } from "../LabScriptsTab";
import { DesignInfoForm } from "../forms/DesignInfoForm";
import { ClinicalInfoForm } from "../forms/ClinicalInfoForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportCardHeader } from "../report-card/ReportCardHeader";
import { ReportCard } from "../report-card/ReportCard";
import { EmptyState } from "../report-card/EmptyState";
import { ProgressBar } from "../ProgressBar";

interface ReportCardContentProps {
  patientData?: {
    firstName: string;
    lastName: string;
  };
  labScripts?: LabScript[];
}

export const ReportCardContent = ({ patientData, labScripts = [] }: ReportCardContentProps) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showDesignInfo, setShowDesignInfo] = React.useState(false);
  const [showClinicInfo, setShowClinicInfo] = React.useState(false);
  const [selectedScript, setSelectedScript] = React.useState<LabScript | null>(null);
  const [localLabScripts, setLocalLabScripts] = React.useState<LabScript[]>(labScripts);

  React.useEffect(() => {
    setLocalLabScripts(labScripts);
  }, [labScripts]);

  const progressSteps = [
    { label: "Request Created", status: "completed" as const },
    { label: "Design Info", status: selectedScript?.designInfo ? "completed" as const : "current" as const },
    { label: "Clinical Info", status: showClinicInfo ? "current" as const : "upcoming" as const },
    { label: "Completed", status: "upcoming" as const }
  ];

  const handleCreateReport = () => {
    console.log("Opening create report dialog");
    setShowCreateDialog(true);
  };

  const handleSubmitReport = (data: any) => {
    console.log("Submitting report with data:", data);
    toast({
      title: "Report Created",
      description: "The lab report has been successfully created.",
    });
    setShowCreateDialog(false);
  };

  const handleDesignInfo = (script: LabScript) => {
    console.log("Opening design info for script:", script.id);
    setSelectedScript(script);
    setShowDesignInfo(true);
  };

  const handleClinicInfo = (script: LabScript) => {
    console.log("Opening clinic info for script:", script.id);
    setSelectedScript(script);
    setShowClinicInfo(true);
  };

  const handleSaveDesignInfo = (updatedScript: LabScript) => {
    console.log("Saving updated script:", updatedScript);
    setLocalLabScripts(prevScripts =>
      prevScripts.map(script =>
        script.id === updatedScript.id ? updatedScript : script
      )
    );

    const savedScripts = localStorage.getItem('labScripts');
    if (savedScripts) {
      const allScripts = JSON.parse(savedScripts);
      const updatedScripts = allScripts.map((script: LabScript) =>
        script.id === updatedScript.id ? updatedScript : script
      );
      localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    }
  };

  return (
    <div className="space-y-6">
      <ReportCardHeader
        patientName={`${patientData?.firstName} ${patientData?.lastName}`}
        onCreateReport={handleCreateReport}
      />
      
      {selectedScript && <ProgressBar steps={progressSteps} />}
      
      <div className="bg-gray-50/50 rounded-lg p-6 border border-gray-100">
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {localLabScripts && localLabScripts.length > 0 ? (
              localLabScripts.map((script) => (
                <ReportCard
                  key={script.id}
                  script={script}
                  onDesignInfo={handleDesignInfo}
                  onClinicInfo={handleClinicInfo}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-[1200px] w-full">
          <DialogHeader>
            <DialogTitle>Create New Lab Report</DialogTitle>
          </DialogHeader>
          <LabReportForm
            onSubmit={handleSubmitReport}
            onCancel={() => setShowCreateDialog(false)}
            patientData={patientData}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDesignInfo} onOpenChange={setShowDesignInfo}>
        <DialogContent className="max-w-[1200px] w-full">
          <DialogHeader>
            <DialogTitle>Design Information</DialogTitle>
            <DialogDescription>
              Design details for Lab Request #{selectedScript?.requestNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedScript && (
            <DesignInfoForm
              onClose={() => setShowDesignInfo(false)}
              scriptId={selectedScript.id}
              script={selectedScript}
              onSave={handleSaveDesignInfo}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showClinicInfo} onOpenChange={setShowClinicInfo}>
        <DialogContent className="max-w-[1200px] w-full">
          <DialogHeader>
            <DialogTitle>Clinical Information</DialogTitle>
            <DialogDescription>
              Clinical details for Lab Request #{selectedScript?.requestNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedScript && (
            <ClinicalInfoForm
              onClose={() => setShowClinicInfo(false)}
              scriptId={selectedScript.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
