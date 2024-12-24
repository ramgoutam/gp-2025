import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientTabs } from "@/components/patient/PatientTabs";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { getLabScripts, saveLabScript, updateLabScript, deleteLabScript } from "@/utils/databaseUtils";

const PatientProfile = () => {
  const [showLabScriptDialog, setShowLabScriptDialog] = React.useState(false);
  const [labScripts, setLabScripts] = React.useState<LabScript[]>([]);
  const { state } = useLocation();
  const { id } = useParams();
  const { toast } = useToast();

  const [patientData, setPatientData] = useState(() => {
    if (state?.patientData) {
      return state.patientData;
    }
    return null;
  });

  const loadScripts = async () => {
    try {
      console.log("Loading scripts for patient:", id);
      const allScripts = await getLabScripts();
      // Filter scripts that match either patientId or patient_id
      const patientScripts = allScripts.filter(script => 
        (script.patientId === id || script.patient_id === id)
      );
      console.log("Filtered scripts for patient:", patientScripts.length);
      setLabScripts(patientScripts);
    } catch (error) {
      console.error("Error loading scripts:", error);
      toast({
        title: "Error",
        description: "Failed to load lab scripts. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (id) {
      loadScripts();
    }
  }, [id]);

  const handleLabScriptSubmit = async (formData: any) => {
    try {
      console.log("Creating new lab script with data:", formData);
      
      const newScript = await saveLabScript({
        ...formData,
        patientId: id,
        doctor_name: formData.doctorName,
        clinic_name: formData.clinicName,
      });

      await loadScripts();
      setShowLabScriptDialog(false);
      
      toast({
        title: "Lab Script Created",
        description: "The lab script has been successfully created.",
      });
    } catch (error) {
      console.error("Error creating lab script:", error);
      toast({
        title: "Error",
        description: "Failed to create lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditLabScript = async (updatedScript: LabScript) => {
    try {
      console.log("Updating lab script:", updatedScript);
      await updateLabScript(updatedScript);
      await loadScripts();
      
      toast({
        title: "Lab Script Updated",
        description: "The lab script has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating lab script:", error);
      toast({
        title: "Error",
        description: "Failed to update lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLabScript = async (scriptToDelete: LabScript) => {
    try {
      console.log("Deleting script:", scriptToDelete);
      await deleteLabScript(scriptToDelete.id);
      await loadScripts();
      
      toast({
        title: "Lab Script Deleted",
        description: "The lab script has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting lab script:", error);
      toast({
        title: "Error",
        description: "Failed to delete lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePatient = (updatedData: typeof patientData) => {
    console.log("Updating patient data:", updatedData);
    setPatientData(updatedData);
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
              onCreateLabScript={() => setShowLabScriptDialog(true)}
              onUpdatePatient={handleUpdatePatient}
            />

            <div className="flex-1 overflow-hidden">
              <PatientTabs
                labScripts={labScripts}
                onCreateLabScript={() => setShowLabScriptDialog(true)}
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
        onOpenChange={setShowLabScriptDialog}
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