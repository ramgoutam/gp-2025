import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HoldReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  selectedReason: string;
  onReasonChange: (reason: string) => void;
}

const HOLD_REASONS = [
  "Hold for Approval",
  "Hold for Insufficient Data",
  "Hold for Insufficient Details",
  "Hold for Other reason"
];

export const HoldReasonDialog = ({
  open,
  onOpenChange,
  onConfirm,
  selectedReason,
  onReasonChange,
}: HoldReasonDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Select Hold Reason</DialogTitle>
        </DialogHeader>
        <Select value={selectedReason} onValueChange={onReasonChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {HOLD_REASONS.map((reason) => (
              <SelectItem 
                key={reason} 
                value={reason}
                className="hover:bg-gray-100"
              >
                {reason}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(selectedReason)}
            disabled={!selectedReason}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Confirm Hold
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};