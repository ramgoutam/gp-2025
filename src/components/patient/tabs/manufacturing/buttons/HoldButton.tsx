import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface HoldButtonProps {
  onHold: (reason: string) => void;
}

export const HoldButton = ({ onHold }: HoldButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [holdReason, setHoldReason] = useState("");

  const handleHold = () => {
    if (holdReason.trim()) {
      onHold(holdReason);
      setHoldReason("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 transform hover:scale-105 transition-all duration-300 group"
        onClick={() => setIsDialogOpen(true)}
      >
        <Pause className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
        Hold
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hold Manufacturing</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for holding the manufacturing process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Textarea
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              placeholder="Enter reason for hold..."
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setHoldReason("");
              setIsDialogOpen(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleHold}>
              Hold Manufacturing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};