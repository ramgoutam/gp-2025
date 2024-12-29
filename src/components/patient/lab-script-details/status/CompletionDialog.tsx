import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
          <DialogTitle>Complete Lab Script</DialogTitle>
          <DialogDescription>
            Would you like to add design information now or skip for later?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onSkip}>
            Skip for Now
          </Button>
          <Button onClick={onDesignInfo}>
            Add Design Info
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};