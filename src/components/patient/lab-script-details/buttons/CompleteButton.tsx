import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useState } from "react";
import { CompletionDialog } from "../CompletionDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompleteButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const CompleteButton = ({ script, onStatusChange }: CompleteButtonProps) => {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);

      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id);

      if (error) {
        console.error("Error updating status:", error);
        throw error;
      }

      onStatusChange(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleComplete = async () => {
    // First update the status to completed
    await handleStatusChange('completed');
    // Then show the dialog
    setShowCompleteDialog(true);
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

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleComplete}
        className="hover:bg-green-50 text-green-600 border-green-200 group transition-all duration-300 transform hover:scale-105"
      >
        <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
        Complete
      </Button>

      <CompletionDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        onSkip={handleSkipForNow}
        onComplete={handleCompleteDesignInfo}
        script={script}
      />
    </>
  );
};