import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useStatusUpdater } from "./StatusUpdater";

interface StatusButtonProps {
  script: LabScript;
  status: LabScript['status'];
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, status, onStatusChange }: StatusButtonProps) => {
  const { updateStatus, isUpdating } = useStatusUpdater();

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    console.log("Handling status change in StatusButton:", script.id, newStatus);
    const success = await updateStatus(script, newStatus);
    if (success) {
      onStatusChange(newStatus);
    }
  };

  if (isUpdating) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="flex items-center gap-2"
      >
        Updating...
      </Button>
    );
  }

  switch (status) {
    case 'pending':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className="flex items-center gap-2 hover:bg-primary/5"
        >
          <Play className="h-4 w-4 text-primary" />
          Start Design
        </Button>
      );
    
    case 'in_progress':
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('paused')}
            className="flex items-center gap-2 hover:bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('hold')}
            className="flex items-center gap-2 hover:bg-red-50 text-red-600 border-red-200"
          >
            <StopCircle className="h-4 w-4" />
            Hold
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('completed')}
            className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200"
          >
            <CheckCircle className="h-4 w-4" />
            Complete
          </Button>
        </div>
      );
    
    case 'paused':
    case 'hold':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className="flex items-center gap-2 hover:bg-primary/5"
        >
          <PlayCircle className="h-4 w-4 text-primary" />
          Resume
        </Button>
      );
    
    case 'completed':
      return null;
    
    default:
      return null;
  }
};