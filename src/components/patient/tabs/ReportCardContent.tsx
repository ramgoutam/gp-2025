import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Plus, Settings, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabReportForm } from "../lab-report/LabReportForm";
import { LabScript } from "../LabScriptsTab";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApplianceSection } from "@/components/lab-script/ApplianceSection";
import { TreatmentSection } from "@/components/lab-script/TreatmentSection";
import { ScrewSection } from "@/components/lab-script/ScrewSection";

const IMPLANT_LIBRARIES = ["Nobel Biocare", "Straumann", "Zimmer Biomet", "Dentsply Sirona"];
const TEETH_LIBRARIES = ["Premium", "Standard", "Economy"];

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
  const [designData, setDesignData] = React.useState({
    designDate: new Date().toISOString().split('T')[0],
    applianceType: "",
    upperTreatment: "None",
    lowerTreatment: "None",
    screw: "",
    implantLibrary: "",
    teethLibrary: "",
    actionsTaken: "",
  });

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

  const handleDesignDataChange = (field: string, value: string) => {
    setDesignData(prev => ({ ...prev, [field]: value }));
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
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designDate">Design Date</Label>
                  <Input
                    id="designDate"
                    type="date"
                    value={designData.designDate}
                    onChange={(e) => handleDesignDataChange("designDate", e.target.value)}
                  />
                </div>
              </div>

              <ApplianceSection
                value={designData.applianceType}
                onChange={(value) => handleDesignDataChange("applianceType", value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <TreatmentSection
                  title="Upper"
                  treatment={designData.upperTreatment}
                  onTreatmentChange={(value) => handleDesignDataChange("upperTreatment", value)}
                />
                <TreatmentSection
                  title="Lower"
                  treatment={designData.lowerTreatment}
                  onTreatmentChange={(value) => handleDesignDataChange("lowerTreatment", value)}
                />
              </div>

              <ScrewSection
                value={designData.screw}
                onChange={(value) => handleDesignDataChange("screw", value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="implantLibrary">Implant Library</Label>
                  <Select
                    value={designData.implantLibrary}
                    onValueChange={(value) => handleDesignDataChange("implantLibrary", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select implant library" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMPLANT_LIBRARIES.map((lib) => (
                        <SelectItem key={lib} value={lib}>
                          {lib}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teethLibrary">Teeth Library</Label>
                  <Select
                    value={designData.teethLibrary}
                    onValueChange={(value) => handleDesignDataChange("teethLibrary", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select teeth library" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEETH_LIBRARIES.map((lib) => (
                        <SelectItem key={lib} value={lib}>
                          {lib}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionsTaken">Designer Actions & Changes Made</Label>
                <Textarea
                  id="actionsTaken"
                  value={designData.actionsTaken}
                  onChange={(e) => handleDesignDataChange("actionsTaken", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showClinicInfo} onOpenChange={setShowClinicInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clinical Information</DialogTitle>
          </DialogHeader>
          {selectedScript && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Request Date</h4>
                  <p>{new Date(selectedScript.requestDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Due Date</h4>
                  <p>{new Date(selectedScript.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Patient Name</h4>
                  <p>{selectedScript.firstName} {selectedScript.lastName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Status</h4>
                  <p className="capitalize">{selectedScript.status}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Notes</h4>
                <p className="mt-1">{selectedScript.notes || "No notes available"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
