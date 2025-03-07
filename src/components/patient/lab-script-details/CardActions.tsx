import { Button } from "@/components/ui/button";
import { Stethoscope, ArrowRight, Trash2, Edit2 } from "lucide-react";

interface CardActionsProps {
  onView: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const CardActions = ({ onView, onDelete, onEdit }: CardActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-2 hover:bg-destructive/5 group-hover:border-destructive/30 transition-all duration-300"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
        Delete
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
      >
        <Edit2 className="h-4 w-4" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
      >
        <Stethoscope className="h-4 w-4" />
        View Details
        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      </Button>
    </div>
  );
};