import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Play, Search, ThumbsDown, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StepButtons } from "./buttons/StepButtons";

interface ManufacturingStepsProps {
  scriptId: string;
  manufacturingStatus: { [key: string]: string };
  sinteringStatus: { [key: string]: string };
  miyoStatus: { [key: string]: string };
  inspectionStatus: { [key: string]: string };
  onStartManufacturing: (scriptId: string) => void;
  onCompleteManufacturing: (scriptId: string) => void;
  onStartSintering: (scriptId: string) => void;
  onCompleteSintering: (scriptId: string) => void;
  onStartMiyo: (scriptId: string) => void;
  onCompleteMiyo: (scriptId: string) => void;
  onStartInspection: (scriptId: string) => void;
  onRejectInspection: (scriptId: string) => void;
  onApproveInspection: (scriptId: string) => void;
}

export const ManufacturingSteps = ({
  scriptId,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus,
  onStartManufacturing,
  onCompleteManufacturing,
  onStartSintering,
  onCompleteSintering,
  onStartMiyo,
  onCompleteMiyo,
  onStartInspection,
  onRejectInspection,
  onApproveInspection,
}: ManufacturingStepsProps) => {
  const [holdDialogOpen, setHoldDialogOpen] = useState(false);
  const [holdReason, setHoldReason] = useState("");
  const [currentStep, setCurrentStep] = useState<string>("");
  const { toast } = useToast();

  const handleHold = (step: string) => {
    setCurrentStep(step);
    setHoldDialogOpen(true);
  };

  const handleHoldSubmit = async () => {
    if (!holdReason.trim()) {
      toast({
        title: "Hold Reason Required",
        description: "Please provide a reason for holding the process.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .upsert({
          lab_script_id: scriptId,
          [`${currentStep}_status`]: 'hold',
          [`${currentStep}_notes`]: holdReason,
        });

      if (error) throw error;

      toast({
        title: "Process On Hold",
        description: `${currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} process has been put on hold.`,
      });

      setHoldDialogOpen(false);
      setHoldReason("");
    } catch (error) {
      console.error("Error updating hold status:", error);
      toast({
        title: "Error",
        description: "Failed to update hold status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      {!manufacturingStatus[scriptId] && (
        <Button 
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onStartManufacturing(scriptId)}
        >
          <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
          Start Manufacturing
        </Button>
      )}

      {manufacturingStatus[scriptId] && (
        <StepButtons
          scriptId={scriptId}
          step="manufacturing"
          status={manufacturingStatus[scriptId]}
          onComplete={onCompleteManufacturing}
          onHold={handleHold}
        />
      )}

      {manufacturingStatus[scriptId] === 'completed' && !sinteringStatus[scriptId] && (
        <Button 
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onStartSintering(scriptId)}
        >
          <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
          Start Sintering
        </Button>
      )}

      {sinteringStatus[scriptId] && (
        <StepButtons
          scriptId={scriptId}
          step="sintering"
          status={sinteringStatus[scriptId]}
          onComplete={onCompleteSintering}
          onHold={handleHold}
        />
      )}

      {sinteringStatus[scriptId] === 'completed' && !miyoStatus[scriptId] && (
        <Button 
          variant="outline"
          className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onStartMiyo(scriptId)}
        >
          <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
          Start Miyo
        </Button>
      )}

      {miyoStatus[scriptId] && (
        <StepButtons
          scriptId={scriptId}
          step="miyo"
          status={miyoStatus[scriptId]}
          onComplete={onCompleteMiyo}
          onHold={handleHold}
        />
      )}

      {miyoStatus[scriptId] === 'completed' && !inspectionStatus[scriptId] && (
        <Button 
          variant="outline"
          className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onStartInspection(scriptId)}
        >
          <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
          Start Inspection
        </Button>
      )}

      {inspectionStatus[scriptId] === 'in_progress' && (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={() => onRejectInspection(scriptId)}
          >
            <ThumbsDown className="w-4 h-4 mr-2 group-hover:rotate-12 transition-all duration-300" />
            Rejected
          </Button>
          <Button 
            variant="outline"
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={() => onApproveInspection(scriptId)}
          >
            <ThumbsUp className="w-4 h-4 mr-2 group-hover:rotate-12 transition-all duration-300" />
            Approved
          </Button>
          <HoldButton onHold={() => handleHold('inspection')} />
        </div>
      )}

      {inspectionStatus[scriptId] === 'hold' && (
        <ResumeButton 
          onResume={() => onStartInspection(scriptId)}
          holdReason={holdReason} 
        />
      )}

      {inspectionStatus[scriptId] === 'approved' && (
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
          Ready to Insert
        </div>
      )}

      {inspectionStatus[scriptId] === 'rejected' && (
        <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md border border-red-200 animate-fade-in">
          Inspection Failed
        </div>
      )}

      <Dialog open={holdDialogOpen} onOpenChange={setHoldDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hold Process</DialogTitle>
            <DialogDescription>
              Please provide a reason for holding the {currentStep} process.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter reason for hold..."
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setHoldDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleHoldSubmit}>
              Confirm Hold
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};