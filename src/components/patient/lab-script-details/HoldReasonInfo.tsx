import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, ExternalLink } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface HoldReasonInfoProps {
  script: LabScript;
}

export const HoldReasonInfo = ({ script }: HoldReasonInfoProps) => {
  const [open, setOpen] = React.useState(false);

  if (!script.holdReason) return null;

  const isApprovalHold = script.holdReason.startsWith("Hold for Approval");
  const [reason, comment] = script.holdReason.split(": ");

  const handleOpenDesignLink = () => {
    if (isApprovalHold && script.designLink) {
      let url = script.designLink;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

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
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500">Design Link</h4>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleOpenDesignLink}
                  className="flex items-center gap-2"
                >
                  Open design link <ExternalLink className="h-4 w-4" />
                </Button>
                <p className="mt-1 text-blue-600 break-all">{script.designLink}</p>
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