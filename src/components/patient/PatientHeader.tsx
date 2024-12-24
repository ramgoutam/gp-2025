import { PatientActions } from "./header/PatientActions";
import { PatientAvatar } from "./header/PatientAvatar";
import { TreatmentButton } from "./treatment/TreatmentButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  const getStatusColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'upper':
      case 'lower':
        return 'bg-primary/5 text-primary border-primary/20 shadow-sm shadow-primary/5';
      case 'dual':
        return 'bg-secondary/10 text-secondary border-secondary/20 shadow-sm shadow-secondary/5';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

      {patientData.treatment_type && (
        <>
          <Separator className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Active Treatment Plan</p>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(patientData.treatment_type)} 
                  px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 
                  hover:scale-105 uppercase tracking-wide`}
              >
                {patientData.treatment_type?.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
              {patientData.upper_treatment && (
                <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 space-y-1 
                  hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                  <p className="text-sm font-medium text-gray-500">Upper Treatment</p>
                  <p className="font-medium text-gray-900">{patientData.upper_treatment}</p>
                </div>
              )}
              {patientData.lower_treatment && (
                <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 space-y-1 
                  hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                  <p className="text-sm font-medium text-gray-500">Lower Treatment</p>
                  <p className="font-medium text-gray-900">{patientData.lower_treatment}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};