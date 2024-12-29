import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { StatusIcon } from "./status/StatusIcon";
import { CompletionDialog } from "./status/CompletionDialog";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
  onDesignInfo?: (script: LabScript) => void;
}

export const StatusButton = ({ script, onStatusChange, onDesignInfo }: StatusButtonProps) => {
  const { toast } = useToast();
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    console.log("Changing status to:", newStatus);
    onStatusChange(newStatus);
    
    if (newStatus === 'completed') {
      setShowCompleteDialog(true);
    } else {
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus.replace('_', ' ')}`
      });
    }
  };

  const handleSkipForNow = async () => {
    console.log("Skipping design info for now");
    setShowCompleteDialog(false);
    toast({
      title: "Lab Script Completed",
      description: "Lab script has been marked as completed"
    });
  };

  const handleDesignInfo = () => {
    console.log("Opening design info for script:", script.id);
    setShowCompleteDialog(false);
    if (onDesignInfo) {
      onDesignInfo(script);
    }
  };

  switch (script.status) {
    case 'pending':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <StatusIcon status="pending" />
          Start Design
        </Button>
      );
    
    case 'in_progress':
      return (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('paused')}
                className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
              >
                <StatusIcon status="paused" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('hold')}
                className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
              >
                <StatusIcon status="hold" />
                Hold
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('completed')}
                className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
              >
                <StatusIcon status="completed" />
                Complete
              </Button>
            </div>
          </div>

          <CompletionDialog
            open={showCompleteDialog}
            onOpenChange={setShowCompleteDialog}
            onSkip={handleSkipForNow}
            onDesignInfo={handleDesignInfo}
          />
        </>
      );
    
    case 'paused':
    case 'hold':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <StatusIcon status={script.status} />
          Resume
        </Button>
      );
    
    case 'completed':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 border-blue-200 group animate-fade-in`}
        >
          <StatusIcon status="completed" />
          Edit Status
        </Button>
      );
    
    default:
      return null;
  }
};