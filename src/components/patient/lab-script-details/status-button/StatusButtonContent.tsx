import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface StatusButtonContentProps {
  status: LabScript['status'];
  onPause: () => void;
  onHold: () => void;
  onComplete: () => void;
  onResume: () => void;
  onEdit: () => void;
}

export const StatusButtonContent = ({
  status,
  onPause,
  onHold,
  onComplete,
  onResume,
  onEdit
}: StatusButtonContentProps) => {
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  switch (status) {
    case 'pending':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onResume}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
          Start Design
        </Button>
      );
    
    case 'in_progress':
      return (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPause}
              className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
            >
              <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onHold}
              className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
            >
              <StopCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Hold
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onComplete}
              className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
            >
              <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Complete
            </Button>
          </div>
        </div>
      );
    
    case 'paused':
    case 'hold':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onResume}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <PlayCircle className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
          Resume
        </Button>
      );
    
    case 'completed':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 border-blue-200 group animate-fade-in`}
        >
          <AlertCircle className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
          Edit Status
        </Button>
      );
    
    default:
      return null;
  }
};