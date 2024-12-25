import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, Edit } from "lucide-react";
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
        className="flex items-center gap-2 transition-all duration-500 ease-in-out animate-pulse"
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
          className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-500 ease-in-out transform hover:scale-[1.03] active:scale-[0.97] hover:shadow-md"
        >
          <Play className="h-4 w-4 text-primary transition-transform duration-500 group-hover:rotate-[360deg]" />
          Start Design
        </Button>
      );
    
    case 'in_progress':
      return (
        <div className="flex gap-2 animate-fade-in transition-all duration-500">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('paused')}
            className="flex items-center gap-2 hover:bg-yellow-50 text-yellow-600 border-yellow-200 transition-all duration-500 ease-in-out transform hover:scale-[1.03] active:scale-[0.97] hover:shadow-md"
          >
            <Pause className="h-4 w-4 transition-all duration-500 group-hover:scale-110" />
            Pause
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('hold')}
            className="flex items-center gap-2 hover:bg-red-50 text-red-600 border-red-200 transition-all duration-500 ease-in-out transform hover:scale-[1.03] active:scale-[0.97] hover:shadow-md"
          >
            <StopCircle className="h-4 w-4 transition-all duration-500 group-hover:scale-110" />
            Hold
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('completed')}
            className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200 transition-all duration-500 ease-in-out transform hover:scale-[1.03] active:scale-[0.97] hover:shadow-md"
          >
            <CheckCircle className="h-4 w-4 transition-all duration-500 group-hover:scale-110" />
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
          className="flex items-center gap-2 hover:bg-primary/5 transition-all duration-500 ease-in-out transform hover:scale-[1.03] active:scale-[0.97] hover:shadow-md"
        >
          <PlayCircle className="h-4 w-4 text-primary transition-all duration-500 group-hover:rotate-[360deg]" />
          Resume
        </Button>
      );
    
    case 'completed':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className="flex items-center gap-2 hover:bg-blue-50 text-blue-600 border-blue-200 transition-all duration-500 ease-in-out transform hover:scale-[1.03] active:scale-[0.97] hover:shadow-md animate-fade-in"
        >
          <Edit className="h-4 w-4 transition-all duration-500 group-hover:rotate-12" />
          Edit Status
        </Button>
      );
    
    default:
      return null;
  }
};