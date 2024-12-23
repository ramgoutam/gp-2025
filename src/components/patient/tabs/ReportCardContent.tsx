import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Plus, Settings, Stethoscope, Calendar, User, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabReportForm } from "../lab-report/LabReportForm";
import { LabScript } from "../LabScriptsTab";
import { DesignInfoForm } from "../forms/DesignInfoForm";
import { ClinicalInfoForm } from "../forms/ClinicalInfoForm";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-gray-900">Patient Report Card</h3>
              <p className="text-sm text-gray-500">
                {patientData?.firstName} {patientData?.lastName}'s medical reports and lab scripts
              </p>
            </div>
          </div>
          <Button onClick={handleCreateReport} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {localLabScripts && localLabScripts.length > 0 ? (
              localLabScripts.map((script) => (
                <Card key={script.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-lg text-gray-900">Lab Request #{script.requestNumber}</h4>
                          <Badge variant="outline" className={getStatusColor(script.status)}>
                            {script.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(script.requestDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Dr. {script.doctorName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileCheck className="w-4 h-4" />
                            <span>Due: {new Date(script.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDesignInfo(script)}
                          className="flex items-center gap-2 hover:bg-primary/5"
                        >
                          <Settings className="h-4 w-4" />
                          Design Info
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClinicInfo(script)}
                          className="flex items-center gap-2 hover:bg-primary/5"
                        >
                          <Stethoscope className="h-4 w-4" />
                          Clinical Info
                        </Button>
                      </div>
                    </div>
                    
                    {script.designInfo && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Design Information</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Design Date:</span>
                            <span className="ml-2 text-gray-900">{script.designInfo.designDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Implant Library:</span>
                            <span className="ml-2 text-gray-900">{script.designInfo.implantLibrary}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No reports available yet</p>
                  <p className="text-sm">Create a new report to get started</p>
                </div>
              </Card>
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