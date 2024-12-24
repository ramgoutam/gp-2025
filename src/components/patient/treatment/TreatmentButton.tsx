import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TreatmentForm } from "./TreatmentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TreatmentButtonProps {
  patientId: string;
  onTreatmentAdded: () => void;
}

export const TreatmentButton = ({ patientId, onTreatmentAdded }: TreatmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Treatment
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Treatment</DialogTitle>
          </DialogHeader>
          <TreatmentForm 
            patientId={patientId} 
            onClose={() => setIsOpen(false)}
            onSubmitSuccess={() => {
              setIsOpen(false);
              onTreatmentAdded();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};