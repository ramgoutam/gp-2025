import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle, FileCheck } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";
import { useState } from "react";
import { HoldReasonDialog } from "./HoldReasonDialog";
import { CompletionDialog } from "./CompletionDialog";
import { useLabScriptStatus } from "@/hooks/useLabScriptStatus";
import { DesignInfoForm } from "@/components/patient/forms/DesignInfoForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
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
      setShowCompleteDialog(true);
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

  const handleDesignInfoClick = () => {
    console.log("Opening design info form");
    setShowDesignForm(true);
  };

  const handleDesignFormClose = () => {
    setShowDesignForm(false);
  };

  const handleDesignFormSave = (updatedScript: LabScript) => {
    console.log("Design info saved:", updatedScript);
    setShowDesignForm(false);
  };

  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const renderButton = () => {
    switch (status) {
      case 'pending':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('in_progress')}
            className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
          >
            <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
            Start Design
          </Button>
        );
      
      case 'in_progress':
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('paused')}
                className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
              >
                <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHoldDialog(true)}
                className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
              >
                <StopCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                Hold
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleComplete}
                className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
                disabled={isUpdating}
              >
                <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                Complete
              </Button>
            </div>
          </div>
        );
      
      case 'paused':
      case 'hold':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange('in_progress')}
            className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
          >
            <PlayCircle className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
            Resume
          </Button>
        );
      
      case 'completed':
        return (
          <div className="flex gap-2 animate-fade-in">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDesignInfoClick}
              className={`${buttonClass} hover:bg-blue-50 text-blue-600 border-blue-200 group`}
            >
              <FileCheck className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
              Complete Design Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('in_progress')}
              className={`${buttonClass} hover:bg-blue-50 text-blue-600 border-blue-200 group`}
            >
              <AlertCircle className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
              Edit Status
            </Button>
          </div>
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

      <CompletionDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        onSkip={() => setShowCompleteDialog(false)}
        onComplete={() => setShowCompleteDialog(false)}
        script={script}
      />

      <Dialog open={showDesignForm} onOpenChange={setShowDesignForm}>
        <DialogContent className="max-w-4xl">
          <DesignInfoForm
            onClose={handleDesignFormClose}
            scriptId={script.id}
            script={script}
            onSave={handleDesignFormSave}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};