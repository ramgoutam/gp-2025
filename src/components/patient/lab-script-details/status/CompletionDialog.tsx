import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LabScript } from "@/types/labScript";

interface CompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkip: () => void;
  onDesignInfo: () => void;
}

export const CompletionDialog = ({
  open,
  onOpenChange,
  onSkip,
  onDesignInfo
}: CompletionDialogProps) => {
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
            variant="default"
            onClick={onDesignInfo}
          >
            Add Design Info
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};