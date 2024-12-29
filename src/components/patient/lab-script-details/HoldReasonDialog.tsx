import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface HoldReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, additionalInfo?: string) => void;
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
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleConfirm = () => {
    onConfirm(selectedReason, additionalInfo);
    setAdditionalInfo("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Select Hold Reason</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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

          {selectedReason && (
            <div className="space-y-2">
              <Label>
                {selectedReason === "Hold for Approval" ? "Design Webview URL" : "Additional Comments"}
              </Label>
              <Input
                type={selectedReason === "Hold for Approval" ? "url" : "text"}
                placeholder={
                  selectedReason === "Hold for Approval"
                    ? "Enter design webview URL"
                    : "Enter additional comments"
                }
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
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