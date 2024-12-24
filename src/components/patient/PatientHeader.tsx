import { useState } from "react";
import { PatientAvatar } from "./header/PatientAvatar";
import { TreatmentButton } from "./treatment/TreatmentButton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PatientForm } from "@/components/PatientForm";
import { DeletePatientDialog } from "./header/DeletePatientDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEditPatient = async (updatedData: any) => {
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
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Failed to update patient information",
        variant: "destructive",
      });
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
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
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
              <div className="flex items-center gap-2 text-sm">
                <button 
                  onClick={() => setShowEditDialog(true)} 
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  Edit
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-gray-500 hover:text-destructive transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">{patientData.email}</p>
          </div>

          {patientData.treatment_type && (
            <div className="flex items-center gap-8 ml-8">
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

          <div className="ml-auto">
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
        <DialogContent className="max-w-2xl">
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