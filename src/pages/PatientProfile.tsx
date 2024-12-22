import React from "react";
import { Navigation } from "@/components/Navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientTabs } from "@/components/patient/PatientTabs";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/components/patient/LabScriptsTab";

const PatientProfile = () => {
  const [showLabScriptDialog, setShowLabScriptDialog] = React.useState(false);
  const [labScripts, setLabScripts] = React.useState<LabScript[]>([]);
  const { toast } = useToast();

  const patientData = {
    firstName: "Willie",
    lastName: "Jennie",
    avatar: "/placeholder.svg",
    note: "Have uneven jawline",
  };

  const handleLabScriptSubmit = (formData: any) => {
    console.log("Creating new lab script with data:", formData);
    
    const newLabScript: LabScript = {
      ...formData,
      id: Date.now().toString(),
      status: "pending",
      treatments: {
        upper: formData.upperTreatment !== "None" ? [formData.upperTreatment] : [],
        lower: formData.lowerTreatment !== "None" ? [formData.lowerTreatment] : [],
      }
    };

    setLabScripts(prev => [...prev, newLabScript]);
    setShowLabScriptDialog(false);
    
    toast({
      title: "Lab Script Created",
      description: "The lab script has been successfully created and added to the patient profile.",
    });
  };

  const handleEditLabScript = (updatedScript: LabScript) => {
    console.log("Updating lab script:", updatedScript);
    setLabScripts(prev => 
      prev.map(script => 
        script.id === updatedScript.id ? updatedScript : script
      )
    );
  };

  const handleDialogChange = (open: boolean) => {
    setShowLabScriptDialog(open);
    if (!open) {
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <div className="text-sm text-gray-500 mb-6">
          Patient list / Patient detail
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <PatientHeader 
            patientData={patientData}
            onCreateLabScript={() => handleDialogChange(true)}
          />

          <PatientTabs
            labScripts={labScripts}
            onCreateLabScript={() => handleDialogChange(true)}
            onEditLabScript={handleEditLabScript}
          />
        </div>
      </main>

      <Dialog 
        open={showLabScriptDialog} 
        onOpenChange={handleDialogChange}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Lab Script</DialogTitle>
            <DialogDescription>
              Create a new lab script for {patientData.firstName} {patientData.lastName}
            </DialogDescription>
          </DialogHeader>
          <LabScriptForm onSubmit={handleLabScriptSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientProfile;