import { LabScript } from "@/types/labScript";
import { HoldReasonDialog } from "./HoldReasonDialog";
import { CompletionDialog } from "./CompletionDialog";
import { useStatusButton } from "./status-button/useStatusButton";
import { StatusButtonContent } from "./status-button/StatusButtonContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();
  const {
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
  } = useStatusButton(script, onStatusChange);

  const { data: currentScript } = useQuery({
    queryKey: ['scriptStatus', script.id],
    queryFn: async () => {
      console.log("Fetching status for script:", script.id);
      try {
        const { data, error } = await supabase
          .from('lab_scripts')
          .select('*')
          .eq('id', script.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching script status:", error);
          throw error;
        }

        return data || script;
      } catch (error) {
        console.error("Unexpected error fetching script status:", error);
        return script;
      }
    },
    refetchInterval: 1000,
    initialData: script,
  });

  // Ensure the status is of type LabScriptStatus
  const status = (currentScript?.status || script.status) as LabScript['status'];

  return (
    <>
      <StatusButtonContent
        status={status}
        onPause={() => handleStatusChange('paused')}
        onHold={() => setShowHoldDialog(true)}
        onComplete={handleComplete}
        onResume={() => handleStatusChange('in_progress')}
        onEdit={() => handleStatusChange('in_progress')}
      />
      
      <HoldReasonDialog
        open={showHoldDialog}
        onOpenChange={setShowHoldDialog}
        onConfirm={handleHoldConfirm}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
      />

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