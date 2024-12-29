import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDesignInfo?: () => void;
  onSkip: () => void;
  dialogType: 'complete' | 'hold';
  selectedReason?: string;
}

export const StatusDialog = ({ 
  open, 
  onOpenChange, 
  onDesignInfo, 
  onSkip,
  dialogType,
  selectedReason 
}: StatusDialogProps) => {
  if (dialogType === 'hold') {
    return null; // Keep existing hold dialog logic in HoldReasonDialog component
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onSkip}
          >
            Skip for Now
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onDesignInfo?.();
            }}
          >
            Complete Design Info
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};