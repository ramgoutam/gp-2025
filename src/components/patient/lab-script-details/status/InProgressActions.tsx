import { Button } from "@/components/ui/button";
import { Pause, StopCircle, CheckCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { HoldReasonDialog } from "../HoldReasonDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

interface InProgressActionsProps {
  onStatusChange: (status: LabScript['status'], holdReason?: string, additionalInfo?: string) => void;
  onDesignInfo?: () => void;
  isUpdating: boolean;
}

export const InProgressActions = ({ onStatusChange, onDesignInfo, isUpdating }: InProgressActionsProps) => {
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleHoldConfirm = (reason: string, additionalInfo?: string) => {
    if (reason) {
      onStatusChange('hold', reason, additionalInfo);
      setShowHoldDialog(false);
      setSelectedReason("");
    }
  };

  const handleComplete = () => {
    setShowCompleteDialog(true);
  };

  const handleSkipForNow = async () => {
    await onStatusChange('completed');
    setShowCompleteDialog(false);
  };

  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onStatusChange('paused')}
        className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
        disabled={isUpdating}
      >
        <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
        Pause
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowHoldDialog(true)}
        className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
        disabled={isUpdating}
      >
        <StopCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
        Hold
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleComplete}
        className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
        disabled={isUpdating}
      >
        <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
        Complete
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDesignInfo}
        className={`${buttonClass} hover:bg-blue-50 text-blue-600 border-blue-200 group`}
        disabled={isUpdating}
      >
        Add Design Info
      </Button>

      <HoldReasonDialog
        open={showHoldDialog}
        onOpenChange={setShowHoldDialog}
        onConfirm={handleHoldConfirm}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
      />

      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lab Script Completed</DialogTitle>
            <DialogDescription>
              Would you like to complete the design information now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={handleSkipForNow}
              disabled={isUpdating}
            >
              Skip for Now
            </Button>
            <Button
              onClick={onDesignInfo}
              disabled={isUpdating}
            >
              Add Design Info
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};