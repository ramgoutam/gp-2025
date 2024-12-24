import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";

type PatientActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  onAddTreatment: () => void;
  isDeleting: boolean;
};

export const PatientActions = ({ 
  onEdit, 
  onDelete, 
  onAddTreatment,
  isDeleting 
}: PatientActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-destructive hover:text-destructive"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={onAddTreatment}
        className="h-6 px-2 bg-primary text-white hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Treatment
      </Button>
    </div>
  );
};