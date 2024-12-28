import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, CheckCircle, Pause, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SinteringStageProps {
  scriptId: string;
  status: string;
  onStart: () => void;
  onComplete: () => void;
  onHold: () => void;
  onResume: () => void;
}

export const SinteringStage = ({
  scriptId,
  status,
  onStart,
  onComplete,
  onHold,
  onResume
}: SinteringStageProps) => {
  const [holdReason, setHoldReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [savedHoldReason, setSavedHoldReason] = useState("");
  const { toast } = useToast();
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const updateSinteringStatus = async (newStatus: string, holdReason?: string) => {
    try {
      console.log("Updating sintering status:", newStatus, "for script:", scriptId);
      const timestamp = new Date().toISOString();
      
      const updates: any = {
        sintering_status: newStatus,
      };

      // Add appropriate timestamp based on status
      if (newStatus === 'in_progress') {
        updates.sintering_started_at = timestamp;
      } else if (newStatus === 'completed') {
        updates.sintering_completed_at = timestamp;
      } else if (newStatus === 'on_hold') {
        updates.sintering_hold_at = timestamp;
        updates.sintering_hold_reason = holdReason;
      }

      const { error } = await supabase
        .from('manufacturing_logs')
        .update(updates)
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      console.log("Sintering status updated successfully");
      toast({
        title: "Status Updated",
        description: `Sintering ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error("Error updating sintering status:", error);
      toast({
        title: "Error",
        description: "Failed to update sintering status",
        variant: "destructive"
      });
    }
  };

  const handleStart = async () => {
    await updateSinteringStatus('in_progress');
    onStart();
  };

  const handleComplete = async () => {
    await updateSinteringStatus('completed');
    onComplete();
  };

  const handleHold = async () => {
    if (holdReason.trim()) {
      await updateSinteringStatus('on_hold', holdReason);
      setSavedHoldReason(holdReason);
      onHold();
      setShowReasonInput(false);
      setHoldReason("");
    }
  };

  const handleResume = async () => {
    await updateSinteringStatus('in_progress');
    onResume();
  };

  if (status === 'pending') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onStart}
        className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
      >
        <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
        Start Sintering
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
            onClick={onComplete}
            className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
          >
            <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            Complete Sintering
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReasonInput(true)}
            className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
          >
            <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            Hold Sintering
          </Button>
        </div>
        {showReasonInput && (
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Enter reason for hold..."
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleHold}
              disabled={!holdReason.trim()}
              className="hover:bg-yellow-50 text-yellow-600 border-yellow-200"
            >
              Confirm Hold
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (status === 'on_hold') {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onResume}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <PlayCircle className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
          Resume Sintering
        </Button>
        {savedHoldReason && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md border border-yellow-200">
            On hold: {savedHoldReason}
          </div>
        )}
      </div>
    );
  }

  return null;
};