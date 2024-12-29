import { Button } from "@/components/ui/button";
import { StopCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useState } from "react";
import { HoldReasonDialog } from "../HoldReasonDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HoldButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const HoldButton = ({ script, onStatusChange }: HoldButtonProps) => {
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: LabScript['status'], holdReason?: string) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);
      console.log("Hold reason:", holdReason);

      const { error } = await supabase
        .from('lab_scripts')
        .update({ 
          status: newStatus,
          hold_reason: holdReason 
        })
        .eq('id', script.id);

      if (error) {
        console.error("Error updating status:", error);
        throw error;
      }

      onStatusChange(newStatus);
      
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleHoldConfirm = (reason: string) => {
    if (reason) {
      handleStatusChange('hold', reason);
      setShowHoldDialog(false);
      setSelectedReason("");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowHoldDialog(true)}
        className="hover:bg-red-50 text-red-600 border-red-200 group transition-all duration-300 transform hover:scale-105"
      >
        <StopCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
        Hold
      </Button>

      <HoldReasonDialog
        open={showHoldDialog}
        onOpenChange={setShowHoldDialog}
        onConfirm={handleHoldConfirm}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
      />
    </>
  );
};