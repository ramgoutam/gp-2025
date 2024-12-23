import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Plus, Settings, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabReportForm } from "../lab-report/LabReportForm";
import { LabScript } from "../LabScriptsTab";
import { DesignInfoForm } from "../forms/DesignInfoForm";
import { ClinicalInfoForm } from "../forms/ClinicalInfoForm";

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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Patient Report Card</h3>
          </div>
          <Button onClick={handleCreateReport} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
        
        <div className="space-y-4">
          {labScripts && labScripts.length > 0 ? (
            labScripts.map((script) => (
              <Card key={script.id} className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Lab Request #{script.requestNumber}</h4>
                    <p className="text-sm text-gray-500">
                      Created on {new Date(script.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDesignInfo(script)}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Design Info
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClinicInfo(script)}
                      className="flex items-center gap-2"
                    >
                      <Stethoscope className="h-4 w-4" />
                      Clinical Info
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4">
              <div className="text-sm text-gray-500">No reports available yet</div>
            </Card>
          )}
        </div>
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