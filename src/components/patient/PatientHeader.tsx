import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PatientForm } from "@/components/PatientForm";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  onUpdatePatient,
}: PatientHeaderProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const handleDelete = () => {
    console.log("Deleting patient:", patientData);
    
    // Get current patients from localStorage
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      const patients = JSON.parse(savedPatients);
      const updatedPatients = patients.filter((p: PatientData) => p.id !== patientData.id);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    }

    setShowDeleteDialog(false);
    toast({
      title: "Success",
      description: "Patient deleted successfully",
    });
    navigate('/');
  };

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {patientData.avatar ? (
            <img
              src={patientData.avatar}
              alt={`${patientData.firstName} ${patientData.lastName}`}
              className="w-16 h-16 rounded-full object-cover bg-gray-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
              {patientData.firstName[0]}
              {patientData.lastName[0]}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {patientData.firstName} {patientData.lastName}
            </h1>
            <p className="text-gray-500 flex items-center gap-2">
              {patientData.note}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {patientData.firstName} {patientData.lastName}'s
              profile and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};