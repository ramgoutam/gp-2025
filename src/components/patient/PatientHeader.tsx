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
  const handleEditPatient = () => {
    // Handle edit patient action
    console.log("Edit patient:", patientData.id);
  };

  const handleDeletePatient = () => {
    // Handle delete patient action
    console.log("Delete patient:", patientData.id);
  };

  const handleAddTreatment = () => {
    // Handle add treatment action
    console.log("Add treatment for patient:", patientData.id);
  };

  return (
    <div className="flex items-center justify-between pb-6 border-b">
      <div className="flex items-center gap-4">
        <PatientAvatar 
          firstName={patientData.firstName} 
          lastName={patientData.lastName}
          avatar={patientData.avatar}
        />
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
        <PatientActions 
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
          onAddTreatment={handleAddTreatment}
          isDeleting={false}
        />
      </div>
    </div>
  );
};