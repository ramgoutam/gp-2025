import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { PatientForm } from "@/components/PatientForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PatientActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  patientData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emergencyContactName?: string;
    emergencyPhone?: string;
    dob: string;
    address?: string;
    sex: string;
  };
}

export const PatientActions = ({ onEdit, onDelete, patientData }: PatientActionsProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  // Parse address into components if it exists
  const parseAddress = (address?: string) => {
    if (!address) return { street: '', city: '', state: '', zipCode: '' };
    
    const parts = address.split(',').map(part => part.trim());
    return {
      street: parts[0] || '',
      city: parts[1] || '',
      state: parts[2] || '',
      zipCode: parts[3] || ''
    };
  };

  const addressParts = parseAddress(patientData.address);

  // Format the patient data for the form
  const formattedPatientData = {
    id: patientData.id,
    firstName: patientData.firstName,
    lastName: patientData.lastName,
    email: patientData.email,
    phone: patientData.phone,
    emergencyContactName: patientData.emergencyContactName || '',
    emergencyPhone: patientData.emergencyPhone || '',
    dob: patientData.dob,
    sex: patientData.sex,
    ...addressParts
  };

  const handleEditClick = () => {
    console.log("Opening edit dialog with data:", formattedPatientData);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (updatedData: any) => {
    try {
      console.log("Handling edit submit with data:", updatedData);
      
      // Update the patient in the database
      const { error } = await supabase
        .from('patients')
        .update({
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          email: updatedData.email,
          phone: updatedData.phone,
          emergency_contact_name: updatedData.emergency_contact_name,
          emergency_phone: updatedData.emergency_phone,
          dob: updatedData.dob,
          address: updatedData.address,
          sex: updatedData.sex,
        })
        .eq('id', patientData.id);

      if (error) throw error;

      onEdit();
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

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditClick}
          className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-primary/10"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-gray-500 hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient Information</DialogTitle>
          </DialogHeader>
          <PatientForm
            onSubmit={handleEditSubmit}
            onClose={() => setShowEditDialog(false)}
            initialData={formattedPatientData}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};