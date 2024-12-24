import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface PatientActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const PatientActions = ({ onEdit, onDelete }: PatientActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="text-gray-500 hover:text-primary transition-all duration-300 hover:scale-105"
      >
        <Edit2 className="h-4 w-4" />
        <span className="ml-1.5">Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-gray-500 hover:text-destructive transition-all duration-300 hover:scale-105"
      >
        <Trash2 className="h-4 w-4" />
        <span className="ml-1.5">Delete</span>
      </Button>
    </div>
  );
};