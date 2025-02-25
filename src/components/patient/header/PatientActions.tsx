import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PatientForm } from "@/components/PatientForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2 } from "lucide-react";

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
    
    try {
      const parts = address.split(',').map(part => part.trim());
      return {
        street: parts[0] || '',
        city: parts[1] || '',
        state: parts[2] || '',
        zipCode: parts[3] || ''
      };
    } catch (error) {
      console.error("Error parsing address:", error);
      return { street: '', city: '', state: '', zipCode: '' };
    }
  };

  const addressParts = parseAddress(patientData?.address);

  const handleEditClick = () => {
    console.log("Opening edit dialog with data:", patientData);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (updatedData: any) => {
    try {
      console.log("Handling edit submit with data:", updatedData);
      
      const fullAddress = `${updatedData.street}, ${updatedData.city}, ${updatedData.state} ${updatedData.zipCode}`;
      
      const { error } = await supabase
        .from('patients')
        .update({
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
          email: updatedData.email,
          phone: updatedData.phone,
          emergency_contact_name: updatedData.emergencyContactName,
          emergency_phone: updatedData.emergencyPhone,
          dob: updatedData.dob,
          address: fullAddress,
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
            initialData={{
              ...patientData,
              ...addressParts
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};