import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
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
  const { state } = useLocation();
  const { id } = useParams();
  const { toast } = useToast();

  // Initialize patient data from route state or fetch from localStorage
  const [patientData, setPatientData] = useState(() => {
    if (state?.patientData) {
      return state.patientData;
    }
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      const patients = JSON.parse(savedPatients);
      return patients.find((p: any) => p.id.toString() === id);
    }
    return null;
  });

  // Load and filter lab scripts for this patient
  useEffect(() => {
    console.log("Loading scripts for patient:", id);
    const savedScripts = localStorage.getItem('labScripts');
    if (savedScripts) {
      try {
        const allScripts = JSON.parse(savedScripts);
        const patientScripts = allScripts.filter((script: LabScript) => 
          script.patientFirstName === patientData?.firstName && 
          script.patientLastName === patientData?.lastName
        );
        console.log("Filtered scripts for patient:", patientScripts);
        setLabScripts(patientScripts);
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    }
  }, [id, patientData]);

  const handleLabScriptSubmit = (formData: any) => {
    console.log("Creating new lab script with data:", formData);
    
    const newScript = {
      ...formData,
      id: Date.now().toString(),
      patientFirstName: patientData.firstName,
      patientLastName: patientData.lastName,
      status: "pending"
    };

    setLabScripts(prevScripts => {
      const updatedScripts = [...prevScripts, newScript];
      const allScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
      const newAllScripts = [...allScripts, newScript];
      localStorage.setItem('labScripts', JSON.stringify(newAllScripts));
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
      
      const allScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
      const newAllScripts = allScripts.map((script: LabScript) => 
        script.id === updatedScript.id ? updatedScript : script
      );
      localStorage.setItem('labScripts', JSON.stringify(newAllScripts));
      
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
      
      const allScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
      const newAllScripts = allScripts.filter((script: LabScript) => script.id !== scriptToDelete.id);
      localStorage.setItem('labScripts', JSON.stringify(newAllScripts));
      
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

  if (!patientData) {
    return <div>Patient not found</div>;
  }

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