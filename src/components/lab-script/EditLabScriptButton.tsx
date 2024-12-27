import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditLabScriptButtonProps {
  onClick: () => void;
}

export const EditLabScriptButton = ({ onClick }: EditLabScriptButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-primary/5"
    >
      <Edit className="h-4 w-4" />
      Edit Script
    </Button>
  );
};