import { PatientActions } from "./header/PatientActions";
import { PatientAvatar } from "./header/PatientAvatar";
import { TreatmentButton } from "./treatment/TreatmentButton";
import { Badge } from "@/components/ui/badge";

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
    console.log("Edit patient:", patientData.id);
  };

  const handleDeletePatient = () => {
    console.log("Delete patient:", patientData.id);
  };

  const handleAddTreatment = () => {
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
        <div className="flex items-center gap-6">
          <PatientAvatar 
            firstName={patientData.firstName} 
            lastName={patientData.lastName}
            avatar={patientData.avatar}
          />
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">
                {patientData.firstName} {patientData.lastName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <button onClick={handleEditPatient} className="hover:text-primary transition-colors">
                  Edit
                </button>
                <span>•</span>
                <button onClick={handleDeletePatient} className="hover:text-destructive transition-colors">
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">{patientData.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {patientData.treatment_type && (
            <div className="flex items-center gap-8">
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

              <div className="flex gap-6">
                {patientData.upper_treatment && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Upper Treatment</p>
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 
                      hover:border-primary/20 hover:shadow-md transition-all duration-300 group min-w-[180px]">
                      <p className="font-medium text-gray-900">{patientData.upper_treatment}</p>
                    </div>
                  </div>
                )}
                {patientData.lower_treatment && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Lower Treatment</p>
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 
                      hover:border-primary/20 hover:shadow-md transition-all duration-300 group min-w-[180px]">
                      <p className="font-medium text-gray-900">{patientData.lower_treatment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <TreatmentButton 
            patientId={patientData.id} 
            onTreatmentAdded={() => {
              onUpdatePatient(patientData);
            }}
          />
        </div>
      </div>
    </div>
  );
};