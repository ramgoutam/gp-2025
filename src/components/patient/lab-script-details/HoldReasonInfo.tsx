import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface HoldReasonInfoProps {
  script: LabScript;
}

export const HoldReasonInfo = ({ script }: HoldReasonInfoProps) => {
  const [open, setOpen] = React.useState(false);

  if (!script.holdReason) return null;

  const isApprovalHold = script.holdReason.startsWith("Hold for Approval");
  const [reason, comment] = script.holdReason.split(": ");

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="p-1 h-auto hover:bg-transparent text-red-600 hover:text-red-800"
      >
        <Info className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hold Reason</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-500">Reason</h4>
              <p className="mt-1">{reason}</p>
            </div>
            {isApprovalHold ? (
              <div>
                <h4 className="font-medium text-sm text-gray-500">Design Webview URL</h4>
                <a 
                  href={comment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-800 break-all"
                >
                  {comment}
                </a>
              </div>
            ) : comment ? (
              <div>
                <h4 className="font-medium text-sm text-gray-500">Additional Comments</h4>
                <p className="mt-1">{comment}</p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};