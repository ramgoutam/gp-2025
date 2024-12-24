import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabScriptsContent } from "./tabs/LabScriptsContent";
import { MedicalRecordContent } from "./tabs/MedicalRecordContent";
import { PatientInformationContent } from "./tabs/PatientInformationContent";
import { ReportCardContent } from "./tabs/ReportCardContent";
import { TreatmentStatusContent } from "./tabs/TreatmentStatusContent";
import { MedicalFormsContent } from "./tabs/MedicalFormsContent";
import { PatientShortcuts } from "./PatientShortcuts";
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
    treatment_type?: string;
    upper_treatment?: string;
    lower_treatment?: string;
  };
}

export const PatientTabs = ({
  labScripts,
  onCreateLabScript,
  onEditLabScript,
  onDeleteLabScript,
  patientData,
}: PatientTabsProps) => {
  const [activeTab, setActiveTab] = React.useState("patient-information");

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
    <div className="space-y-6 animate-fade-in">
      <PatientShortcuts onTabChange={setActiveTab} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b mb-6 bg-transparent h-auto p-0 space-x-6 overflow-x-auto">
          <TabsTrigger
            value="patient-information"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary whitespace-nowrap"
          >
            Patient Information
          </TabsTrigger>
          <TabsTrigger
            value="treatment-status"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary whitespace-nowrap"
          >
            Treatment Status
          </TabsTrigger>
          <TabsTrigger
            value="appointment-history"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary whitespace-nowrap"
          >
            Appointment History
          </TabsTrigger>
          <TabsTrigger
            value="lab-scripts"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary whitespace-nowrap"
          >
            Lab Scripts
          </TabsTrigger>
          <TabsTrigger
            value="report-card"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary whitespace-nowrap"
          >
            Report Card
          </TabsTrigger>
          <TabsTrigger
            value="next-treatment"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary whitespace-nowrap"
          >
            Next Treatment
          </TabsTrigger>
          <TabsTrigger
            value="medical-record"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary whitespace-nowrap"
          >
            Medical Record
          </TabsTrigger>
          <TabsTrigger
            value="medical-forms"
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary whitespace-nowrap"
          >
            Medical Forms
          </TabsTrigger>
        </TabsList>

        <div className="animate-fade-in">
          <TabsContent value="patient-information">
            <PatientInformationContent {...patientData} />
          </TabsContent>

          <TabsContent value="treatment-status">
            <TreatmentStatusContent 
              labScripts={labScripts} 
              patientData={patientData}
            />
          </TabsContent>

          <TabsContent value="appointment-history">
            <div className="text-gray-600 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              Appointment history will go here
            </div>
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
            <div className="text-gray-600 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              Next treatment details will go here
            </div>
          </TabsContent>

          <TabsContent value="medical-record">
            <MedicalRecordContent />
          </TabsContent>

          <TabsContent value="medical-forms">
            <MedicalFormsContent />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};