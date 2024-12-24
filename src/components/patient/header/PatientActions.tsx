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
        className="text-gray-600 hover:text-gray-900"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  );
};