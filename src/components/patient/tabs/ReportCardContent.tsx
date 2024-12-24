import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabReportForm } from "../lab-report/LabReportForm";
import { LabScript } from "@/types/labScript";
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
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showDesignInfo, setShowDesignInfo] = React.useState(false);
  const [showClinicalInfo, setShowClinicalInfo] = React.useState(false);
  const [selectedScript, setSelectedScript] = React.useState<LabScript | null>(null);
  const [localLabScripts, setLocalLabScripts] = React.useState<LabScript[]>(labScripts);

  React.useEffect(() => {
    const sortedScripts = [...labScripts].sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    );
    console.log("Sorted report card scripts:", sortedScripts);
    setLocalLabScripts(sortedScripts);
  }, [labScripts]);

  const getProgressSteps = (script: LabScript) => {
    console.log("Generating progress steps for script:", script);
    return [
      { 
        label: "Request Created", 
        status: "completed" as const 
      },
      { 
        label: "Design Info", 
        status: script?.designInfo ? "completed" as const : "current" as const 
      },
      {
        label: "Clinical Info",
        status: script?.clinicalInfo 
          ? "completed" as const 
          : script?.designInfo 
          ? "current" as const 
          : "upcoming" as const
      },
      { 
        label: "Completed", 
        status: script?.status === "completed" 
          ? "completed" as const 
          : "upcoming" as const 
      }
    ];
  };

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
    <div className="flex flex-col h-full space-y-6 max-w-[1200px] mx-auto">
      <ReportCardHeader
        patientName={`${patientData?.firstName} ${patientData?.lastName}`}
        onCreateReport={handleCreateReport}
      />
      
      <div className="flex-1 min-h-0 bg-white rounded-lg border border-gray-100">
        <ScrollArea className="h-[calc(100vh-500px)] p-6">
          <div className="space-y-4 pr-4 pb-8">
            {localLabScripts && localLabScripts.length > 0 ? (
              localLabScripts.map((script) => (
                <div key={script.id}>
                  <ReportCard
                    script={script}
                    onDesignInfo={handleDesignInfo}
                    onClinicalInfo={handleClinicalInfo}
                    onUpdateScript={handleUpdateScript}
                  />
                </div>
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
    </div>
  );
};
