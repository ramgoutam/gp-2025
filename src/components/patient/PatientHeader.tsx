import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PatientActions } from "./header/PatientActions";
import { PatientAvatar } from "./header/PatientAvatar";
import { TreatmentButton } from "./treatment/TreatmentButton";

interface PatientHeaderProps {
  patientData: any;
  onCreateLabScript: () => void;
  onUpdatePatient: (data: any) => void;
}

export const PatientHeader = ({
  patientData,
  onCreateLabScript,
  onUpdatePatient,
}: PatientHeaderProps) => {
  return (
    <div className="flex items-center justify-between pb-6 border-b">
      <div className="flex items-center gap-4">
        <PatientAvatar patient={patientData} />
        <div>
          <h1 className="text-2xl font-semibold">
            {patientData.firstName} {patientData.lastName}
          </h1>
          <p className="text-sm text-gray-500">{patientData.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <TreatmentButton 
          patientId={patientData.id} 
          onTreatmentAdded={() => {
            // Refresh patient data after treatment is added
            onUpdatePatient(patientData);
          }}
        />
        <Button
          onClick={onCreateLabScript}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Lab Script
        </Button>
        <PatientActions patient={patientData} onUpdatePatient={onUpdatePatient} />
      </div>
    </div>
  );
};