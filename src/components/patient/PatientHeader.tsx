import { useState } from "react";
import { PatientAvatar } from "./header/PatientAvatar";
import { TreatmentButton } from "./treatment/TreatmentButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PatientForm } from "@/components/PatientForm";
import { DeletePatientDialog } from "./header/DeletePatientDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PatientActions } from "./header/PatientActions";
import { TreatmentStatus } from "./header/TreatmentStatus";
import { Loader } from "lucide-react";

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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEditPatient = async (updatedData: any) => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .update({
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
          email: updatedData.email,
          phone: updatedData.phone,
          sex: updatedData.sex,
          dob: updatedData.dob,
          address: updatedData.address,
        })
        .eq('id', patientData.id)
        .select()
        .single();

      if (error) throw error;

      onUpdatePatient({
        ...patientData,
        ...data,
      });

      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Patient information updated successfully",
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Failed to update patient information",
        variant: "destructive",
        className: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePatient = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Patient deleted successfully",
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
        className: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-purple-100/50">
        <div className="flex items-center gap-6">
          <div className="transform transition-transform duration-300 hover:scale-105">
            <PatientAvatar 
              firstName={patientData.firstName} 
              lastName={patientData.lastName}
              avatar={patientData.avatar}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {patientData.firstName} {patientData.lastName}
              </h1>
              <PatientActions 
                onEdit={() => setShowEditDialog(true)}
                onDelete={() => setShowDeleteDialog(true)}
              />
            </div>
            <p className="text-sm text-gray-500">{patientData.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <TreatmentStatus
            treatmentType={patientData.treatment_type}
            upperTreatment={patientData.upper_treatment}
            lowerTreatment={patientData.lower_treatment}
          />
          
          <div className="animate-fade-in">
            <TreatmentButton 
              patientId={patientData.id} 
              onTreatmentAdded={() => {
                onUpdatePatient(patientData);
              }}
            />
          </div>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-purple-50/30">
          {isUpdating ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <p className="text-gray-600">Updating patient information...</p>
            </div>
          ) : (
            <PatientForm
              initialData={{
                firstName: patientData.firstName,
                lastName: patientData.lastName,
                email: patientData.email,
                phone: patientData.phone,
                sex: patientData.sex,
                dob: patientData.dob,
                address: patientData.address,
              }}
              onSubmitSuccess={handleEditPatient}
              onClose={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeletePatientDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeletePatient}
        isDeleting={isDeleting}
        patientName={`${patientData.firstName} ${patientData.lastName}`}
      />
    </div>
  );
};
