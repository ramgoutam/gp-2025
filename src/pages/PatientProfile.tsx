import React, { useState } from "react";
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
  const [patientData, setPatientData] = useState({
    firstName: "Willie",
    lastName: "Jennie",
    avatar: "/placeholder.svg",
    note: "Have uneven jawline",
    email: "willie.jennie@example.com",
    phone: "+1234567890",
    sex: "female",
    dob: "1990-01-01",
  });
  const { toast } = useToast();

  // Load scripts only once on mount
  React.useEffect(() => {
    console.log("Initial load of scripts");
    const savedScripts = localStorage.getItem('labScripts');
    if (savedScripts) {
      try {
        const scripts = JSON.parse(savedScripts);
        console.log("Loaded scripts:", scripts);
        setLabScripts(scripts);
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLabScriptSubmit = (formData: any) => {
    console.log("Creating new lab script with data:", formData);
    
    setLabScripts(prevScripts => {
      const updatedScripts = [...prevScripts, formData];
      localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
      return updatedScripts;
    });

    setShowLabScriptDialog(false);
    
    toast({
      title: "Lab Script Created",
      description: "The lab script has been successfully created and added to the patient profile.",
    });
  };

  const handleEditLabScript = (updatedScript: LabScript) => {
    console.log("Updating lab script:", updatedScript);
    
    setLabScripts(prevScripts => {
      const updatedScripts = prevScripts.map(script => 
        script.id === updatedScript.id ? updatedScript : script
      );
      localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
      return updatedScripts;
    });
    
    toast({
      title: "Lab Script Updated",
      description: "The lab script has been successfully updated.",
    });
  };

  const handleDeleteLabScript = (scriptToDelete: LabScript) => {
    console.log("Deleting script:", scriptToDelete);
    
    setLabScripts(prevScripts => {
      const updatedScripts = prevScripts.filter(script => script.id !== scriptToDelete.id);
      localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
      return updatedScripts;
    });
    
    toast({
      title: "Lab Script Deleted",
      description: "The lab script has been successfully deleted.",
    });
  };

  const handleUpdatePatient = (updatedData: typeof patientData) => {
    console.log("Updating patient data:", updatedData);
    setPatientData(updatedData);
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
            onUpdatePatient={handleUpdatePatient}
          />

          <PatientTabs
            labScripts={labScripts}
            onCreateLabScript={() => handleDialogChange(true)}
            onEditLabScript={handleEditLabScript}
            onDeleteLabScript={handleDeleteLabScript}
            patientData={patientData}
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
          <LabScriptForm onSubmit={handleLabScriptSubmit} patientData={patientData} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientProfile;