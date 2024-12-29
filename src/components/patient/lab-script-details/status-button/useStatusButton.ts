import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";

export const useStatusButton = (
  script: LabScript,
  onStatusChange: (newStatus: LabScript['status']) => void
) => {
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
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
      
      if (newStatus === 'completed') {
        setShowCompleteDialog(true);
      } else {
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

  const handleHoldConfirm = (reason: string) => {
    if (reason) {
      handleStatusChange('hold', reason);
      setShowHoldDialog(false);
      setSelectedReason("");
    }
  };

  const handleComplete = () => {
    handleStatusChange('completed');
  };

  const handleCompleteDesignInfo = () => {
    setShowCompleteDialog(false);
    toast({
      title: "Design Info",
      description: "Redirecting to complete design information..."
    });
  };

  const handleSkipForNow = () => {
    setShowCompleteDialog(false);
    toast({
      title: "Lab Script Completed",
      description: "Lab script has been marked as completed"
    });
  };

  return {
    showHoldDialog,
    setShowHoldDialog,
    showCompleteDialog,
    setShowCompleteDialog,
    selectedReason,
    setSelectedReason,
    handleStatusChange,
    handleHoldConfirm,
    handleComplete,
    handleCompleteDesignInfo,
    handleSkipForNow
  };
};