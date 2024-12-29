import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, PenTool, ArrowRight } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { DesignInfoForm } from "@/components/patient/forms/DesignInfoForm";

interface CompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSkip: () => void;
  onComplete: () => void;
  script: LabScript;
}

export const CompletionDialog = ({
  open,
  onOpenChange,
  onSkip,
  onComplete,
  script
}: CompletionDialogProps) => {
  const { toast } = useToast();
  const [showDesignForm, setShowDesignForm] = useState(false);
  const isDesignInfoCompleted = script.designInfo !== undefined;

  const handleDesignInfoClick = () => {
    console.log("Opening design info form for script:", script.id);
    if (script.status !== 'completed') {
      toast({
        title: "Error",
        description: "Lab script must be completed before adding design information",
        variant: "destructive"
      });
      return;
    }
    setShowDesignForm(true);
  };

  const handleDesignFormClose = () => {
    console.log("Closing design info form");
    setShowDesignForm(false);
    onOpenChange(false);
  };

  const handleDesignFormSave = (updatedScript: LabScript) => {
    console.log("Design info saved:", updatedScript);
    setShowDesignForm(false);
    onComplete();
    onOpenChange(false);
  };

  if (showDesignForm) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DesignInfoForm
            onClose={handleDesignFormClose}
            scriptId={script.id}
            script={script}
            onSave={handleDesignFormSave}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lab Script Completed</DialogTitle>
          <DialogDescription>
            Would you like to complete the design information now?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDesignInfoClick}
            className="flex items-center gap-2 hover:bg-primary/5 group transition-all duration-300"
          >
            {isDesignInfoCompleted ? (
              <PenTool className="h-4 w-4" />
            ) : (
              <Settings className="h-4 w-4" />
            )}
            {isDesignInfoCompleted ? 'Edit Design Info' : 'Add Design Info'}
            <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
          </Button>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onSkip}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleDesignInfoClick}
            >
              Complete Design Info
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};