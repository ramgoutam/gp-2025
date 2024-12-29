import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const HOLD_REASONS = [
  "Hold for Approval",
  "Hold for Insufficient Data",
  "Hold for Insufficient Details",
  "Hold for Other reason"
];

interface HoldDialogProps {
  showDialog: boolean;
  onClose: () => void;
  selectedReason: string;
  onReasonChange: (value: string) => void;
  designLink: string;
  onDesignLinkChange: (value: string) => void;
  files: FileList | null;
  onFilesChange: (files: FileList | null) => void;
  comment: string;
  onCommentChange: (value: string) => void;
  onConfirm: () => void;
}

export const HoldDialog = ({
  showDialog,
  onClose,
  selectedReason,
  onReasonChange,
  designLink,
  onDesignLinkChange,
  files,
  onFilesChange,
  comment,
  onCommentChange,
  onConfirm
}: HoldDialogProps) => {
  const needsComment = selectedReason && selectedReason !== "Hold for Approval";
  const needsDesignInfo = selectedReason === "Hold for Approval";

  return (
    <Dialog open={showDialog} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Select Hold Reason</DialogTitle>
        </DialogHeader>
        <Select value={selectedReason} onValueChange={onReasonChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[200]">
            {HOLD_REASONS.map((reason) => (
              <SelectItem key={reason} value={reason} className="hover:bg-gray-100">
                {reason}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {needsDesignInfo && (
          <div className="space-y-4">
            <Input
              placeholder="Enter design weblink"
              value={designLink}
              onChange={(e) => onDesignLinkChange(e.target.value)}
            />
            <div className="space-y-2">
              <Input
                type="file"
                multiple
                onChange={(e) => onFilesChange(e.target.files)}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500">Upload design pictures</p>
            </div>
          </div>
        )}

        {needsComment && (
          <div className="space-y-2">
            <Textarea
              placeholder="Enter detailed reason..."
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!selectedReason || (needsComment && !comment) || (needsDesignInfo && !designLink)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Confirm Hold
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};