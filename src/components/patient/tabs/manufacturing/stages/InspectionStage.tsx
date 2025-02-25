import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, CheckCircle, Ban, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InspectionStageProps {
  scriptId: string;
  status: string;
  onStart: () => void;
  onComplete: () => void;
  onHold: () => void;
  onResume: () => void;
}

export const InspectionStage = ({
  scriptId,
  status,
  onStart,
  onComplete,
  onHold,
  onResume
}: InspectionStageProps) => {
  const [holdReason, setHoldReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [savedHoldReason, setSavedHoldReason] = useState("");
  const { toast } = useToast();
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const updateInspectionStatus = async (newStatus: string, holdReason?: string) => {
    try {
      console.log("Updating inspection status:", newStatus, "for script:", scriptId);
      const timestamp = new Date().toISOString();
      
      const updates: any = {
        inspection_status: newStatus,
      };

      if (newStatus === 'in_progress') {
        updates.inspection_started_at = timestamp;
      } else if (newStatus === 'completed') {
        updates.inspection_completed_at = timestamp;
      } else if (newStatus === 'on_hold') {
        updates.inspection_hold_at = timestamp;
        updates.inspection_hold_reason = holdReason;
      }

      const { error } = await supabase
        .from('manufacturing_logs')
        .update(updates)
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      console.log("Inspection status updated successfully");
      toast({
        title: "Status Updated",
        description: `Inspection ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error("Error updating inspection status:", error);
      toast({
        title: "Error",
        description: "Failed to update inspection status",
        variant: "destructive"
      });
    }
  };

  const handleStart = async () => {
    await updateInspectionStatus('in_progress');
    onStart();
  };

  const handleComplete = async () => {
    await updateInspectionStatus('completed');
    onComplete();
  };

  const handleHold = async () => {
    if (holdReason.trim()) {
      await updateInspectionStatus('on_hold', holdReason);
      setSavedHoldReason(holdReason);
      onHold();
      setShowReasonInput(false);
      setHoldReason("");
    }
  };

  const handleResume = async () => {
    await updateInspectionStatus('in_progress');
    onResume();
  };

  if (status === 'pending') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleStart}
        className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
      >
        <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
        Start Inspection
      </Button>
    );
  }

  if (status === 'in_progress') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleComplete}
            className={`${buttonClass} hover:bg-emerald-50 text-emerald-600 border-emerald-200 group`}
          >
            <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            Approve Appliance
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReasonInput(true)}
            className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
          >
            <Ban className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            Reject Appliance
          </Button>
        </div>
        {showReasonInput && (
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Enter reason for rejection..."
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleHold}
              disabled={!holdReason.trim()}
              className="hover:bg-red-50 text-red-600 border-red-200"
            >
              Confirm Rejection
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (status === 'on_hold') {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          Appliance Inspection Failed
          {savedHoldReason && (
            <div className="mt-1 text-sm text-red-600">
              Reason: {savedHoldReason}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
