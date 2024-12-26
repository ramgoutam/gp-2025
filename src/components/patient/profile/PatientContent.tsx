import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientTabs } from "@/components/patient/PatientTabs";
import { LabScript } from "@/types/labScript";

interface PatientContentProps {
  patientData: any;
  labScripts: LabScript[];
  showLabScriptDialog: boolean;
  setShowLabScriptDialog: (show: boolean) => void;
  onLabScriptSubmit: (formData: any) => void;
  onEditLabScript: (script: LabScript) => void;
  onDeleteLabScript: (script: LabScript) => void;
  onUpdatePatient: (data: any) => void;
  id?: string;
}

export const PatientContent = ({
  patientData,
  labScripts,
  showLabScriptDialog,
  setShowLabScriptDialog,
  onLabScriptSubmit,
  onEditLabScript,
  onDeleteLabScript,
  onUpdatePatient,
  id,
}: PatientContentProps) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 animate-fade-in">
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto py-8 px-4 h-full flex flex-col">
          <div className="text-sm text-gray-500 mb-6 hover:text-primary transition-colors duration-300">
            Patient list / Patient detail
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col overflow-hidden border">
            <PatientHeader 
              patientData={patientData}
              onCreateLabScript={() => setShowLabScriptDialog(true)}
              onUpdatePatient={onUpdatePatient}
            />

            <div className="flex-1 overflow-hidden">
              <PatientTabs
                labScripts={labScripts}
                onCreateLabScript={() => setShowLabScriptDialog(true)}
                onEditLabScript={onEditLabScript}
                onDeleteLabScript={onDeleteLabScript}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Create Lab Script
            </DialogTitle>
            <DialogDescription>
              Create a new lab script for {patientData.firstName} {patientData.lastName}
            </DialogDescription>
          </DialogHeader>
          <LabScriptForm 
            onSubmit={onLabScriptSubmit} 
            patientData={patientData}
            patientId={id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};