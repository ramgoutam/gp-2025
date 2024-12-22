import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabScriptsContent } from "./tabs/LabScriptsContent";
import { MedicalRecordContent } from "./tabs/MedicalRecordContent";
import { PatientInformationContent } from "./tabs/PatientInformationContent";
import { LabScript } from "./LabScriptsTab";

interface PatientTabsProps {
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
  patientData: {
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
  patientData,
}: PatientTabsProps) => {
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

      <TabsContent value="appointment-history">
        <div className="text-gray-600">Appointment history will go here</div>
      </TabsContent>

      <TabsContent value="lab-scripts">
        <LabScriptsContent
          labScripts={labScripts}
          onCreateLabScript={onCreateLabScript}
          onEditLabScript={onEditLabScript}
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