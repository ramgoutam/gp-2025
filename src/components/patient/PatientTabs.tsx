import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabScriptsContent } from "./tabs/LabScriptsContent";
import { PatientInformationContent } from "./tabs/PatientInformationContent";
import { MedicalFormsContent } from "./tabs/MedicalFormsContent";
import { ReportCardContent } from "./tabs/ReportCardContent";
import { ManufacturingContent } from "./tabs/ManufacturingContent";
import { TreatmentStatusContent } from "./tabs/TreatmentStatusContent";
import { LabScript } from "@/types/labScript";

interface PatientTabsProps {
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
  onDeleteLabScript: (script: LabScript) => void;
  patientData?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    sex?: string;
    dob?: string;
    address?: string;
    treatmentType?: string;
    upperTreatment?: string;
    lowerTreatment?: string;
  };
}

export const PatientTabs = ({
  labScripts,
  onCreateLabScript,
  onEditLabScript,
  onDeleteLabScript,
  patientData,
}: PatientTabsProps) => {
  return (
    <Tabs defaultValue="lab-scripts" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto gap-6">
        <TabsTrigger
          value="lab-scripts"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary"
        >
          Lab Scripts
        </TabsTrigger>
        <TabsTrigger
          value="patient-information"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary"
        >
          Patient Information
        </TabsTrigger>
        <TabsTrigger
          value="medical-forms"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary"
        >
          Medical Forms
        </TabsTrigger>
        <TabsTrigger
          value="report-card"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary"
        >
          Report Card
        </TabsTrigger>
        <TabsTrigger
          value="manufacturing"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary"
        >
          Manufacturing
        </TabsTrigger>
        <TabsTrigger
          value="next-treatment"
          className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4 rounded-none transition-all duration-300 hover:text-primary"
        >
          Next Treatment
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="lab-scripts">
          <LabScriptsContent
            labScripts={labScripts}
            onCreateLabScript={onCreateLabScript}
            onEditLabScript={onEditLabScript}
            onDeleteLabScript={onDeleteLabScript}
            patientData={patientData}
          />
        </TabsContent>

        <TabsContent value="patient-information">
          <PatientInformationContent {...patientData} />
        </TabsContent>

        <TabsContent value="medical-forms">
          <MedicalFormsContent patientId={patientData?.id || ''} />
        </TabsContent>

        <TabsContent value="report-card">
          <ReportCardContent
            patientId={patientData?.id || ''}
            patientName={`${patientData?.firstName || ''} ${patientData?.lastName || ''}`}
          />
        </TabsContent>

        <TabsContent value="manufacturing">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <ManufacturingContent patientId={patientData?.id || ''} />
          </div>
        </TabsContent>

        <TabsContent value="next-treatment">
          <div className="text-gray-600 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <TreatmentStatusContent {...patientData} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};