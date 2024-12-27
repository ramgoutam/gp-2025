import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientInformationContent } from "./tabs/PatientInformationContent";
import { MedicalFormsContent } from "./tabs/MedicalFormsContent";
import { LabScriptsContent } from "./tabs/LabScriptsContent";
import { ReportCardContent } from "./tabs/ReportCardContent";
import { TreatmentStatusContent } from "./tabs/TreatmentStatusContent";
import { ManufacturingContent } from "./tabs/ManufacturingContent";
import { Patient } from "@/types/patient";
import { LabScript } from "@/types/labScript";

export interface PatientTabsProps {
  patient: Patient;
  labScripts: LabScript[];
  onCreateLabScript: () => void;
  onEditLabScript: (updatedScript: LabScript) => void;
  onDeleteLabScript: (script: LabScript) => void;
}

export const PatientTabs = ({
  patient,
  labScripts,
  onCreateLabScript,
  onEditLabScript,
  onDeleteLabScript,
}: PatientTabsProps) => {
  return (
    <Tabs defaultValue="information" className="w-full">
      <TabsList>
        <TabsTrigger value="information">Patient Information</TabsTrigger>
        <TabsTrigger value="medical-forms">Medical Forms</TabsTrigger>
        <TabsTrigger value="lab-scripts">Lab Scripts</TabsTrigger>
        <TabsTrigger value="report-card">Report Card</TabsTrigger>
        <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
        <TabsTrigger value="treatment-status">Treatment Status</TabsTrigger>
      </TabsList>

      <TabsContent value="information">
        <PatientInformationContent 
          firstName={patient.firstName}
          lastName={patient.lastName}
          email={patient.email}
          phone={patient.phone}
          sex={patient.sex}
          dob={patient.dob}
          address={patient.address}
          treatmentType={patient.treatment_type}
          upperTreatment={patient.upper_treatment}
          lowerTreatment={patient.lower_treatment}
        />
      </TabsContent>

      <TabsContent value="medical-forms">
        <MedicalFormsContent patientId={patient.id} />
      </TabsContent>

      <TabsContent value="lab-scripts">
        <LabScriptsContent
          labScripts={labScripts}
          onCreateLabScript={onCreateLabScript}
          onEditLabScript={onEditLabScript}
          onDeleteLabScript={onDeleteLabScript}
          patientData={{
            firstName: patient.firstName,
            lastName: patient.lastName,
          }}
        />
      </TabsContent>

      <TabsContent value="report-card">
        <ReportCardContent 
          patientData={{
            firstName: patient.firstName,
            lastName: patient.lastName,
            id: patient.id
          }}
          labScripts={labScripts}
        />
      </TabsContent>

      <TabsContent value="manufacturing">
        <ManufacturingContent patientId={patient.id} />
      </TabsContent>

      <TabsContent value="treatment-status">
        <TreatmentStatusContent 
          labScripts={labScripts}
          patientData={{
            id: patient.id,
            treatment_type: patient.treatment_type,
            upper_treatment: patient.upper_treatment,
            lower_treatment: patient.lower_treatment,
            surgery_date: patient.surgery_date
          }}
        />
      </TabsContent>
    </Tabs>
  );
};