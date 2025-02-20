import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabReportForm } from "../lab-report/LabReportForm";
import { LabScript } from "@/types/labScript";
import { DesignInfoForm } from "../forms/DesignInfoForm";
import { ClinicalInfoForm } from "../forms/ClinicalInfoForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportCardHeader } from "../report-card/ReportCardHeader";
import { ReportCard } from "../report-card/ReportCard";
import { EmptyState } from "../report-card/EmptyState";
import { useState, useEffect } from "react";

interface ReportCardContentProps {
  patientData?: {
    firstName: string;
    lastName: string;
    id: string;
  };
  labScripts?: LabScript[];
}

export const ReportCardContent = ({ patientData, labScripts = [] }: ReportCardContentProps) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDesignInfo, setShowDesignInfo] = useState(false);
  const [showClinicalInfo, setShowClinicalInfo] = useState(false);
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);
  const [localLabScripts, setLocalLabScripts] = useState<LabScript[]>(labScripts);

  useEffect(() => {
    const sortedScripts = [...labScripts].sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    );
    console.log("Sorted report card scripts:", sortedScripts);
    setLocalLabScripts(sortedScripts);
  }, [labScripts]);

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

  const handleClinicalInfo = () => {
    console.log("Opening clinical info for script:", selectedScript?.id);
    setShowClinicalInfo(true);
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
  };

  const handleSaveClinicalInfo = (updatedScript: LabScript) => {
    console.log("Saving clinical info:", updatedScript);
    setLocalLabScripts(prevScripts =>
      prevScripts.map(script =>
        script.id === updatedScript.id ? updatedScript : script
      )
    );
    setShowClinicalInfo(false);
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
                    onClinicalInfo={() => {
                      setSelectedScript(script);
                      handleClinicalInfo();
                    }}
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
            labScriptId={selectedScript?.id}
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

      <Dialog open={showClinicalInfo} onOpenChange={setShowClinicalInfo}>
        <DialogContent className="max-w-[1200px] w-full">
          <DialogHeader>
            <DialogTitle>Clinical Information</DialogTitle>
            <DialogDescription>
              Clinical details for Lab Request #{selectedScript?.requestNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedScript && (
            <ClinicalInfoForm
              onClose={() => setShowClinicalInfo(false)}
              script={selectedScript}
              onSave={handleSaveClinicalInfo}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};