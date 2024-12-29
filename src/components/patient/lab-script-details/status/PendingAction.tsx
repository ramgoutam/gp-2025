import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface PendingActionProps {
  onStatusChange: (status: LabScript['status']) => void;
  isUpdating: boolean;
}

export const PendingAction = ({ onStatusChange, isUpdating }: PendingActionProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onStatusChange('in_progress')}
      className="transition-all duration-300 transform hover:scale-105 hover:bg-primary/5 group animate-fade-in"
      disabled={isUpdating}
    >
      <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
      Start Design
    </Button>
  );
};