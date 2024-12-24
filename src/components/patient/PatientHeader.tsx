import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientForm } from "@/components/PatientForm";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PatientAvatar } from "./header/PatientAvatar";
import { PatientActions } from "./header/PatientActions";
import { DeletePatientDialog } from "./header/DeletePatientDialog";

type PatientData = {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  note?: string;
  email?: string;
  phone?: string;
  sex?: string;
  dob?: string;
  address?: string;
};

type PatientHeaderProps = {
  patientData: PatientData;
  onCreateLabScript?: () => void;
  onUpdatePatient: (updatedData: PatientData) => void;
};

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

  const handleEditSubmit = (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    sex: string;
    dob: string;
    address: string;
  }) => {
    console.log("Updating patient data:", formData);
    
    const updatedData = {
      ...patientData,
      ...formData,
    };
    
    onUpdatePatient(updatedData);
    setShowEditDialog(false);
    
    toast({
      title: "Success",
      description: "Patient profile updated successfully",
    });
  };

  const handleDelete = async () => {
    console.log("Deleting patient:", patientData);
    setIsDeleting(true);
    
    try {
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientData.id);

      if (deleteError) throw deleteError;

      const { data: files } = await supabase
        .from('lab_script_files')
        .select('file_path')
        .eq('lab_script_id', patientData.id);

      if (files && files.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('lab_script_files')
          .remove(files.map(file => file.file_path));

        if (storageError) {
          console.error('Error deleting files from storage:', storageError);
        }
      }

      setShowDeleteDialog(false);
      toast({
        title: "Success",
        description: "Patient and all associated data deleted successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <PatientAvatar
            firstName={patientData.firstName}
            lastName={patientData.lastName}
            avatar={patientData.avatar}
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {patientData.firstName} {patientData.lastName}
            </h1>
            <p className="text-gray-500 flex items-center gap-2">
              {patientData.note}
              <PatientActions
                onEdit={() => setShowEditDialog(true)}
                onDelete={() => setShowDeleteDialog(true)}
                onAddTreatment={onCreateLabScript || (() => {})}
                isDeleting={isDeleting}
              />
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Patient Profile</DialogTitle>
          </DialogHeader>
          <PatientForm
            initialData={{
              firstName: patientData.firstName,
              lastName: patientData.lastName,
              email: patientData.email || "",
              phone: patientData.phone || "",
              sex: patientData.sex || "",
              dob: patientData.dob || "",
              address: patientData.address || "",
            }}
            onSubmitSuccess={handleEditSubmit}
          />
        </DialogContent>
      </Dialog>

      <DeletePatientDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        patientName={`${patientData.firstName} ${patientData.lastName}`}
      />
    </>
  );
};