import { Button } from "@/components/ui/button";
import { LabScript } from "@/types/labScript";
import { useState } from "react";
import { Play, Pause, StopCircle, CheckCircle } from "lucide-react";

interface StatusButtonProps {
  script: LabScript;
  status: LabScript["status"];
  onStatusChange: (newStatus: LabScript["status"]) => Promise<boolean>;
}

export const StatusButton = ({ script, status, onStatusChange }: StatusButtonProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: LabScript["status"]) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      console.log("Changing status from", status, "to", newStatus);
      const success = await onStatusChange(newStatus);
      
      if (!success) {
        console.log("Status update failed");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === "completed") return null;

  const renderStatusButtons = () => {
    switch (status) {
      case "pending":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleStatusChange("in_progress")}
            disabled={isUpdating}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <Play className="h-4 w-4" />
            Start
          </Button>
        );
      case "in_progress":
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("paused")}
              disabled={isUpdating}
              className="flex items-center gap-2 hover:bg-yellow-50 text-yellow-600 border-yellow-200"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("hold")}
              disabled={isUpdating}
              className="flex items-center gap-2 hover:bg-red-50 text-red-600 border-red-200"
            >
              <StopCircle className="h-4 w-4" />
              Hold
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("completed")}
              disabled={isUpdating}
              className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200"
            >
              <CheckCircle className="h-4 w-4" />
              Complete
            </Button>
          </div>
        );
      case "paused":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("in_progress")}
            disabled={isUpdating}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <Play className="h-4 w-4" />
            Resume
          </Button>
        );
      case "hold":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("in_progress")}
            disabled={isUpdating}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <Play className="h-4 w-4" />
            Resume
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-end">
      {renderStatusButtons()}
    </div>
  );
};