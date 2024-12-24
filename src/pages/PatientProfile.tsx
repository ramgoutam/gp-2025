import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientTabs } from "@/components/patient/PatientTabs";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/components/patient/LabScriptsTab";
import { getLabScripts, saveLabScript, updateLabScript } from "@/utils/labScriptStorage";

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
    const allScripts = getLabScripts();
    const patientScripts = allScripts.filter(script => 
      script.patientFirstName === patientData?.firstName && 
      script.patientLastName === patientData?.lastName
    );
    console.log("Filtered unique scripts for patient:", patientScripts);
    setLabScripts(patientScripts);
  }, [id, patientData]);

  const handleLabScriptSubmit = (formData: any) => {
    console.log("Creating new lab script with data:", formData);
    
    const newScript = {
      ...formData,
      id: Date.now().toString(),
      patientFirstName: patientData.firstName,
      patientLastName: patientData.lastName,
      status: "pending",
      requestNumber: `REQ-${Date.now()}`
    };

    if (saveLabScript(newScript)) {
      setLabScripts(prevScripts => [...prevScripts, newScript]);
      setShowLabScriptDialog(false);
      
      toast({
        title: "Lab Script Created",
        description: "The lab script has been successfully created and added to the patient profile.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to create lab script. A duplicate may exist.",
        variant: "destructive"
      });
    }
  };

  const handleEditLabScript = (updatedScript: LabScript) => {
    console.log("Updating lab script:", updatedScript);
    updateLabScript(updatedScript);
    
    setLabScripts(prevScripts => {
      const filtered = prevScripts.filter(script => script.id !== updatedScript.id);
      return [...filtered, updatedScript];
    });
    
    toast({
      title: "Lab Script Updated",
      description: "The lab script has been successfully updated.",
    });
  };

  const handleDeleteLabScript = (scriptToDelete: LabScript) => {
    console.log("Deleting script:", scriptToDelete);
    
    const allScripts = getLabScripts().filter(script => script.id !== scriptToDelete.id);
    localStorage.setItem('labScripts', JSON.stringify(allScripts));
    
    setLabScripts(prevScripts => 
      prevScripts.filter(script => script.id !== scriptToDelete.id)
    );
    
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
  };

  if (!patientData) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto py-8 px-4 h-full flex flex-col">
          <div className="text-sm text-gray-500 mb-6">
            Patient list / Patient detail
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex-1 flex flex-col overflow-hidden">
            <PatientHeader 
              patientData={patientData}
              onCreateLabScript={() => handleDialogChange(true)}
              onUpdatePatient={handleUpdatePatient}
            />

            <div className="flex-1 overflow-hidden">
              <PatientTabs
                labScripts={labScripts}
                onCreateLabScript={() => handleDialogChange(true)}
                onEditLabScript={handleEditLabScript}
                onDeleteLabScript={handleDeleteLabScript}
                patientData={patientData}
              />
            </div>
          </div>
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