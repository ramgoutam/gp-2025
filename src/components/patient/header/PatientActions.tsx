import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { PatientForm } from "@/components/PatientForm";
import { useToast } from "@/hooks/use-toast";

interface PatientActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  patientData?: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emergencyContactName?: string;
    emergencyPhone?: string;
    dob: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    sex: string;
  };
}

export const PatientActions = ({ onEdit, onDelete, patientData }: PatientActionsProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (updatedData: any) => {
    try {
      console.log("Handling edit submit with data:", updatedData);
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
            initialData={patientData}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};