import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { HoldReasonDialog } from "./HoldReasonDialog";
import { StatusDialog } from "./status-button/StatusDialog";
import { StatusButtonContent } from "./status-button/StatusButtonContent";
import { supabase } from "@/integrations/supabase/client";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
  onDesignInfo?: () => void;
}

export const StatusButton = ({ script, onStatusChange, onDesignInfo }: StatusButtonProps) => {
  const { toast } = useToast();
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleStatusChange = async (newStatus: LabScript['status'], holdReason?: string, additionalInfo?: string) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);
      console.log("Hold reason:", holdReason);
      console.log("Additional info:", additionalInfo);

      const updates: any = { 
        status: newStatus,
        hold_reason: holdReason,
        specific_instructions: additionalInfo
      };

      if (holdReason === "Hold for Approval") {
        updates.design_link = additionalInfo;
        updates.specific_instructions = null;
      }

      const { error } = await supabase
        .from('lab_scripts')
        .update(updates)
        .eq('id', script.id);

      if (error) {
        console.error("Error updating status:", error);
        throw error;
      }

      onStatusChange(newStatus);
      
      if (newStatus !== 'completed') {
        toast({
          title: "Status Updated",
          description: `Status changed to ${newStatus.replace('_', ' ')}`
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleHoldConfirm = (reason: string, additionalInfo?: string) => {
    if (reason) {
      handleStatusChange('hold', reason, additionalInfo);
      setShowHoldDialog(false);
      setSelectedReason("");
    }
  };

  const handleComplete = () => {
    setShowCompleteDialog(true);
  };

  const handleSkipForNow = () => {
    handleStatusChange('completed');
    setShowCompleteDialog(false);
    toast({
      title: "Lab Script Completed",
      description: "Lab script has been marked as completed"
    });
  };

  return (
    <>
      <StatusButtonContent
        status={script.status}
        onStatusChange={handleStatusChange}
        onHoldClick={() => setShowHoldDialog(true)}
        onCompleteClick={handleComplete}
      />

      <HoldReasonDialog
        open={showHoldDialog}
        onOpenChange={setShowHoldDialog}
        onConfirm={handleHoldConfirm}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
      />

      <StatusDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        onDesignInfo={onDesignInfo}
        onSkip={handleSkipForNow}
        dialogType="complete"
        selectedReason={selectedReason}
      />
    </>
  );
};