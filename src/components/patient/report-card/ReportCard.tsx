import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { LabReportForm } from "../lab-report/LabReportForm";
import { LabScript } from "../LabScriptsTab";
import { DesignInfoForm } from "../forms/DesignInfoForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportCardHeader } from "./ReportCardHeader";
import { EmptyState } from "./EmptyState";
import { ReportCardViewDialog } from "./ReportCardViewDialog";

interface ReportCardProps {
  patientData?: {
    firstName: string;
    lastName: string;
  };
  labScripts?: LabScript[];
  onDesignInfo?: (script: LabScript) => void;
  onClinicalInfo?: (script: LabScript) => void;
  onUpdateScript?: (updatedScript: LabScript) => void;
}

export const ReportCard = ({ 
  patientData, 
  labScripts = [],
  onDesignInfo,
  onClinicalInfo,
  onUpdateScript 
}: ReportCardProps) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDesignInfo, setShowDesignInfo] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);

  // Update local state when labScripts prop changes
  useEffect(() => {
    console.log("Lab scripts updated in ReportCard:", labScripts);
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

  const handleViewReportCard = (script: LabScript) => {
    console.log("Opening report card view for script:", script);
    setSelectedScript(script);
    setShowReportCard(true);
  };

  const isReportCardViewable = (script: LabScript) => {
    return script.designInfo && script.clinicalInfo;
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <ReportCardHeader
        patientName={`${patientData?.firstName} ${patientData?.lastName}`}
        onCreateReport={handleCreateReport}
      />
      
      <div className="bg-gray-50/50 rounded-lg p-6 border border-gray-100">
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {labScripts && labScripts.length > 0 ? (
              labScripts.map((script) => (
                <div key={script.id} className="bg-white p-6 rounded-lg border border-gray-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">Lab Request #{script.requestNumber}</h4>
                      <p className="text-gray-500">Status: {script.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDesignInfo?.(script)}
                      >
                        Design Info
                      </Button>
                      {isReportCardViewable(script) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReportCard(script)}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          View Report Card
                        </Button>
                      )}
                    </div>
                  </div>
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
              onSave={onUpdateScript}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedScript && (
        <ReportCardViewDialog
          open={showReportCard}
          onOpenChange={setShowReportCard}
          script={selectedScript}
        />
      )}
    </div>
  );
};