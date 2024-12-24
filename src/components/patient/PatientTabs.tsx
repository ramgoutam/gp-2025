import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabScriptsContent } from "./tabs/LabScriptsContent";
import { MedicalRecordContent } from "./tabs/MedicalRecordContent";
import { PatientInformationContent } from "./tabs/PatientInformationContent";
import { ReportCardContent } from "./tabs/ReportCardContent";
import { TreatmentStatusContent } from "./tabs/TreatmentStatusContent";
import { LabScript } from "@/types/labScript";

interface PatientTabsProps {
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
  onDeleteLabScript: (script: LabScript) => void;
  patientData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    sex: string;
    dob: string;
  };
}

export const PatientTabs = ({
  labScripts,
  onCreateLabScript,
  onEditLabScript,
  onDeleteLabScript,
  patientData,
}: PatientTabsProps) => {
  const handleCreateLabScript = () => {
    console.log("Creating lab script in PatientTabs");
    onCreateLabScript();
  };

  const handleEditLabScript = (updatedScript: LabScript) => {
    console.log("Handling lab script edit in PatientTabs:", updatedScript);
    onEditLabScript(updatedScript);
  };

  const handleDeleteLabScript = (script: LabScript) => {
    console.log("Handling lab script delete in PatientTabs:", script);
    onDeleteLabScript(script);
  };

  return (
    <Tabs defaultValue="patient-information" className="w-full">
      <TabsList className="w-full justify-start border-b mb-6 bg-transparent h-auto p-0 space-x-6">
        <TabsTrigger
          value="patient-information"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
        >
          Patient Information
        </TabsTrigger>
        <TabsTrigger
          value="treatment-status"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
        >
          Treatment Status
        </TabsTrigger>
        <TabsTrigger
          value="appointment-history"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
        >
          Appointment History
        </TabsTrigger>
        <TabsTrigger
          value="lab-scripts"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
        >
          Lab Scripts
        </TabsTrigger>
        <TabsTrigger
          value="report-card"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
        >
          Report Card
        </TabsTrigger>
        <TabsTrigger
          value="next-treatment"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
        >
          Next Treatment
        </TabsTrigger>
        <TabsTrigger
          value="medical-record"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none"
        >
          Medical Record
        </TabsTrigger>
      </TabsList>

      <TabsContent value="patient-information">
        <PatientInformationContent {...patientData} />
      </TabsContent>

      <TabsContent value="treatment-status">
        <TreatmentStatusContent labScripts={labScripts} />
      </TabsContent>

      <TabsContent value="appointment-history">
        <div className="text-gray-600">Appointment history will go here</div>
      </TabsContent>

      <TabsContent value="lab-scripts">
        <LabScriptsContent
          labScripts={labScripts}
          onCreateLabScript={handleCreateLabScript}
          onEditLabScript={handleEditLabScript}
          onDeleteLabScript={handleDeleteLabScript}
          patientData={patientData}
        />
      </TabsContent>

      <TabsContent value="report-card">
        <ReportCardContent 
          patientData={patientData} 
          labScripts={labScripts}
        />
      </TabsContent>

      <TabsContent value="next-treatment">
        <div className="text-gray-600">Next treatment details will go here</div>
      </TabsContent>

      <TabsContent value="medical-record">
        <MedicalRecordContent />
      </TabsContent>
    </Tabs>
  );
};