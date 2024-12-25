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
    const success = await updateStatus(script, newStatus);
    if (success) {
      onStatusChange(newStatus);
    }
  };

  const getStatusButtons = () => {
    if (isUpdating) {
      return [
        <Button
          key="loading"
          variant="outline"
          size="sm"
          disabled
          className="flex items-center gap-2"
        >
          Updating...
        </Button>
      ];
    }

    switch (status) {
      case 'pending':
        return [
          <Button
            key="start"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('in_progress')}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <Play className="h-4 w-4 text-primary" />
            Start Design
          </Button>
        ];
      
      case 'in_progress':
        return [
          <Button
            key="pause"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('paused')}
            className="flex items-center gap-2 hover:bg-yellow-50 text-yellow-600 border-yellow-200 mr-2"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>,
          <Button
            key="hold"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('hold')}
            className="flex items-center gap-2 hover:bg-red-50 text-red-600 border-red-200 mr-2"
          >
            <StopCircle className="h-4 w-4" />
            Hold
          </Button>,
          <Button
            key="complete"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('completed')}
            className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200"
          >
            <CheckCircle className="h-4 w-4" />
            Complete
          </Button>
        ];
      
      case 'paused':
      case 'hold':
        return [
          <Button
            key="resume"
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('in_progress')}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <PlayCircle className="h-4 w-4 text-primary" />
            Resume
          </Button>
        ];
      
      case 'completed':
        return null;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {getStatusButtons()}
    </div>
  );
};