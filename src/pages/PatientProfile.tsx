import React, { useState, useEffect } from "react";
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

  const loadScripts = () => {
    console.log("Loading scripts in PatientProfile");
    const savedScripts = localStorage.getItem('labScripts');
    if (savedScripts) {
      try {
        const scripts = JSON.parse(savedScripts);
        console.log("Loaded scripts in PatientProfile:", scripts);
        setLabScripts(scripts);
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    }
  };

  useEffect(() => {
    loadScripts();
    
    const handleLabScriptsUpdate = () => {
      console.log("Lab scripts update event received in PatientProfile");
      loadScripts();
    };

    window.addEventListener('labScriptsUpdated', handleLabScriptsUpdate);
    
    return () => {
      window.removeEventListener('labScriptsUpdated', handleLabScriptsUpdate);
    };
  }, []);

  const handleLabScriptSubmit = (formData: any) => {
    console.log("Creating new lab script in PatientProfile:", formData);
    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
    
    const newScript: LabScript = {
      ...formData,
      id: Date.now().toString(),
      status: "pending",
      treatments: {
        upper: formData.upperTreatment !== "None" ? [formData.upperTreatment] : [],
        lower: formData.lowerTreatment !== "None" ? [formData.lowerTreatment] : []
      }
    };

    const updatedScripts = [...existingScripts, newScript];
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    setLabScripts(updatedScripts);
    setShowLabScriptDialog(false);
    
    window.dispatchEvent(new Event('labScriptsUpdated'));
    
    toast({
      title: "Lab Script Created",
      description: "The lab script has been successfully created and added to the patient profile.",
    });
  };

  const handleEditLabScript = (updatedScript: LabScript) => {
    console.log("Updating lab script in PatientProfile:", updatedScript);
    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
    
    const updatedScripts = existingScripts.map((script: LabScript) => 
      script.id === updatedScript.id ? updatedScript : script
    );
    
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    setLabScripts(updatedScripts);
    
    window.dispatchEvent(new Event('labScriptsUpdated'));
    
    toast({
      title: "Lab Script Updated",
      description: "The lab script has been successfully updated.",
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