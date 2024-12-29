import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, StopCircle, CheckCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { HoldReasonDialog } from "../HoldReasonDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface InProgressActionsProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status'], holdReason?: string, additionalInfo?: string) => void;
  onDesignInfo?: () => void;
}

export const InProgressActions = ({ script, onStatusChange, onDesignInfo }: InProgressActionsProps) => {
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const handleHoldConfirm = (reason: string, additionalInfo?: string) => {
    if (reason) {
      onStatusChange('hold', reason, additionalInfo);
      setShowHoldDialog(false);
      setSelectedReason("");
    }
  };

  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusChange('paused')}
          className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
        >
          <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Pause
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHoldDialog(true)}
          className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
        >
          <StopCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Hold
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCompleteDialog(true)}
          className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
        >
          <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Complete
        </Button>
      </div>

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
              Would you like to add design information now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                onStatusChange('completed');
                setShowCompleteDialog(false);
              }}
            >
              Skip for Now
            </Button>
            <Button
              onClick={() => {
                onDesignInfo?.();
                setShowCompleteDialog(false);
              }}
            >
              Add Design Info
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};