import { Play, Pause, StopCircle, PlayCircle, CheckCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";
import { useState } from "react";
import { HoldReasonDialog } from "./HoldReasonDialog";
import { CompletionDialog } from "./CompletionDialog";
import { useLabScriptStatus } from "@/hooks/useLabScriptStatus";
import { BaseButton } from "./buttons/BaseButton";
import { CompletedStateButtons } from "./buttons/CompletedStateButtons";
import { DesignInfoForm } from "@/components/patient/forms/DesignInfoForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showDesignForm, setShowDesignForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const { updateStatus, isUpdating } = useLabScriptStatus();

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

        if (!data) {
          console.log("No data found for script status:", script.id);
          return script;
        }

        return mapDatabaseLabScript(data);
      } catch (error) {
        console.error("Unexpected error fetching script status:", error);
        return script;
      }
    },
    refetchInterval: 1000,
    initialData: script,
  });

  const status = currentScript?.status || script.status;

  const handleComplete = async () => {
    console.log("Handling complete action for script:", script.id);
    const success = await updateStatus(script, 'completed');
    if (success) {
      onStatusChange('completed');
    }
  };

  const handleHoldConfirm = async (reason: string) => {
    if (reason) {
      const success = await updateStatus(script, 'hold', reason);
      if (success) {
        onStatusChange('hold');
        setShowHoldDialog(false);
        setSelectedReason("");
      }
    }
  };

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    console.log("Handling status change:", newStatus);
    const success = await updateStatus(script, newStatus);
    if (success) {
      onStatusChange(newStatus);
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus.replace('_', ' ')}`
      });
    }
  };

  const handleDesignInfoSave = (updatedScript: LabScript) => {
    console.log("Design info saved:", updatedScript);
    setShowDesignForm(false);
  };

  const renderButton = () => {
    switch (status) {
      case 'pending':
        return (
          <BaseButton
            onClick={() => handleStatusChange('in_progress')}
            icon={Play}
            label="Start Design"
            className="hover:bg-primary/5 group"
          />
        );
      
      case 'in_progress':
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <BaseButton
                onClick={() => handleStatusChange('paused')}
                icon={Pause}
                label="Pause"
                className="hover:bg-yellow-50 text-yellow-600 border-yellow-200 group"
              />
              <BaseButton
                onClick={() => setShowHoldDialog(true)}
                icon={StopCircle}
                label="Hold"
                className="hover:bg-red-50 text-red-600 border-red-200 group"
              />
              <BaseButton
                onClick={handleComplete}
                icon={CheckCircle}
                label="Complete"
                className="hover:bg-green-50 text-green-600 border-green-200 group"
                disabled={isUpdating}
              />
            </div>
          </div>
        );
      
      case 'paused':
      case 'hold':
        return (
          <BaseButton
            onClick={() => handleStatusChange('in_progress')}
            icon={PlayCircle}
            label="Resume"
            className="hover:bg-primary/5 group animate-fade-in"
          />
        );
      
      case 'completed':
        return (
          <CompletedStateButtons
            script={script}
            onDesignInfo={() => setShowDesignForm(true)}
            onStatusChange={handleStatusChange}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {renderButton()}
      
      <HoldReasonDialog
        open={showHoldDialog}
        onOpenChange={setShowHoldDialog}
        onConfirm={handleHoldConfirm}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
      />

      <Dialog open={showDesignForm} onOpenChange={setShowDesignForm}>
        <DialogContent className="max-w-4xl">
          <DesignInfoForm
            onClose={() => setShowDesignForm(false)}
            scriptId={script.id}
            script={script}
            onSave={handleDesignInfoSave}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};