import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface PatientActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const PatientActions = ({ onEdit, onDelete }: PatientActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
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
  );
};