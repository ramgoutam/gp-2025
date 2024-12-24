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
        className="text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors duration-300"
      >
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-gray-500 hover:text-destructive hover:bg-destructive/10 transition-colors duration-300"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};