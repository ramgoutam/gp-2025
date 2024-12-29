import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface PausedActionProps {
  onStatusChange: (status: LabScript['status']) => void;
  isUpdating: boolean;
}

export const PausedAction = ({ onStatusChange, isUpdating }: PausedActionProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onStatusChange('in_progress')}
      className="transition-all duration-300 transform hover:scale-105 hover:bg-primary/5 group animate-fade-in"
      disabled={isUpdating}
    >
      <PlayCircle className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
      Resume
    </Button>
  );
};