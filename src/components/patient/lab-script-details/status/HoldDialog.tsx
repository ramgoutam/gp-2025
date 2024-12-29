import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onConfirm,
}: HoldDialogProps) => {
  const needsComment = ["Hold for Insufficient Data", "Hold for Insufficient Details", "Hold for Other reason"].includes(selectedReason);
  const isApprovalHold = selectedReason === "Hold for Approval";

  return (
    <Dialog open={showDialog} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hold Manufacturing</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Select
              value={selectedReason}
              onValueChange={onReasonChange}
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="Hold for Approval">Hold for Approval</SelectItem>
                <SelectItem value="Hold for Insufficient Data">Hold for Insufficient Data</SelectItem>
                <SelectItem value="Hold for Insufficient Details">Hold for Insufficient Details</SelectItem>
                <SelectItem value="Hold for Other reason">Hold for Other reason</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isApprovalHold && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="designLink">Design Link</Label>
                <Input
                  id="designLink"
                  value={designLink}
                  onChange={(e) => onDesignLinkChange(e.target.value)}
                  placeholder="Enter design link"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="files">Upload Files</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  onChange={(e) => onFilesChange(e.target.files)}
                />
              </div>
            </>
          )}

          {needsComment && (
            <div className="grid gap-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => onCommentChange(e.target.value)}
                placeholder="Enter reason details"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Hold</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};