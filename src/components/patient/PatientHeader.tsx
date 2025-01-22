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
      const fullAddress = `${updatedData.street}, ${updatedData.city}, ${updatedData.state} ${updatedData.zipCode}`;
      
      const { data, error } = await supabase
        .from('patients')
        .update({
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
          email: updatedData.email,
          phone: updatedData.phone,
          emergency_contact_name: updatedData.emergencyContactName,
          emergency_phone: updatedData.emergencyPhone,
          sex: updatedData.sex,
          dob: updatedData.dob,
          address: fullAddress,
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
        className: "bg-success text-white",
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Failed to update patient information",
        variant: "destructive",
        className: "bg-destructive text-white",
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
        className: "bg-success text-white",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
        className: "bg-destructive text-white",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Format patient data for the actions component
  const formattedPatientData = {
    id: patientData.id,
    firstName: patientData.first_name,
    lastName: patientData.last_name,
    email: patientData.email,
    phone: patientData.phone,
    emergencyContactName: patientData.emergency_contact_name,
    emergencyPhone: patientData.emergency_phone,
    dob: patientData.dob,
    sex: patientData.sex,
    address: patientData.address,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="transform transition-transform duration-300 hover:scale-105">
            <PatientAvatar 
              firstName={patientData.first_name} 
              lastName={patientData.last_name}
              avatar={patientData.avatar}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-primary">
                {patientData.first_name} {patientData.last_name}
              </h1>
              <PatientActions 
                onEdit={() => setShowEditDialog(true)}
                onDelete={() => setShowDeleteDialog(true)}
                patientData={formattedPatientData}
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
        <DialogContent className="max-w-2xl bg-white">
          {isUpdating ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <p className="text-gray-600">Updating patient information...</p>
            </div>
          ) : (
            <PatientForm
              initialData={{
                firstName: patientData.first_name,
                lastName: patientData.last_name,
                email: patientData.email,
                phone: patientData.phone,
                emergencyContactName: patientData.emergency_contact_name || "",
                emergencyPhone: patientData.emergency_phone || "",
                sex: patientData.sex,
                dob: patientData.dob,
                street: patientData.street || "",
                city: patientData.city || "",
                state: patientData.state || "",
                zipCode: patientData.zipCode || "",
              }}
              onSubmit={handleEditPatient}
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
        patientName={`${patientData.first_name} ${patientData.last_name}`}
      />
    </div>
  );
};