import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PatientForm } from "@/components/PatientForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { createPatient } from "@/utils/databaseUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const PageHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createPatientMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (newPatient) => {
      if (newPatient) {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
        toast({
          title: "Success",
          description: "Patient added successfully",
          className: "bg-primary text-white",
        });
        navigate(`/patient/${newPatient.id}`);
      }
    },
    onError: (error) => {
      console.error('Error creating patient:', error);
      toast({
        title: "Error",
        description: "Failed to create patient. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddPatient = async (formData: any) => {
    const transformedData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      emergency_contact_name: formData.emergencyContactName,
      emergency_phone: formData.emergencyPhone,
      sex: formData.sex,
      dob: formData.dob,
      address: formData.address
    };

    createPatientMutation.mutate(transformedData);
  };

  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-500">Manage and view all patient records</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="h-4 w-4" />
            Add New Patient
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Patient Registration</DialogTitle>
          </DialogHeader>
          <PatientForm 
            onSubmitSuccess={handleAddPatient}
            onClose={() => {
              const closeButton = document.querySelector('[aria-label="Close"]');
              if (closeButton instanceof HTMLButtonElement) {
                closeButton.click();
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};