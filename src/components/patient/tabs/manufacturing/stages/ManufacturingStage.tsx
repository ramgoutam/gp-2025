import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Pause, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StartButton } from './StartButton';

interface ManufacturingStageProps {
  scriptId: string;
  status: string;
  onStart: () => void;
  onComplete: () => void;
  onHold: () => void;
  onResume: () => void;
  manufacturingType: string;
}

export const ManufacturingStage = ({
  scriptId,
  status,
  onStart,
  onComplete,
  onHold,
  onResume,
  manufacturingType
}: ManufacturingStageProps) => {
  const [holdReason, setHoldReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [savedHoldReason, setSavedHoldReason] = useState("");
  const { toast } = useToast();
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const updateManufacturingStatus = async (newStatus: string, holdReason?: string) => {
    try {
      console.log("Updating manufacturing status:", newStatus, "for script:", scriptId);
      const timestamp = new Date().toISOString();
      
      // First check if the lab script is completed
      const { data: labScript } = await supabase
        .from('lab_scripts')
        .select('status')
        .eq('id', scriptId)
        .single();

      const { data: existingLog } = await supabase
        .from('manufacturing_logs')
        .select('*')
        .eq('lab_script_id', scriptId)
        .maybeSingle();

      if (!existingLog) {
        console.log("Creating new manufacturing log for script:", scriptId);
        const { error: insertError } = await supabase
          .from('manufacturing_logs')
          .insert([{
            lab_script_id: scriptId,
            manufacturing_status: newStatus,
            manufacturing_started_at: newStatus === 'in_progress' ? timestamp : null,
            manufacturing_completed_at: newStatus === 'completed' ? timestamp : null,
            manufacturing_hold_at: newStatus === 'on_hold' ? timestamp : null,
            manufacturing_hold_reason: holdReason
          }]);

        if (insertError) throw insertError;
      } else {
        console.log("Updating existing manufacturing log for script:", scriptId);
        const updates: any = {
          manufacturing_status: newStatus,
        };

        if (newStatus === 'in_progress') {
          updates.manufacturing_started_at = timestamp;
        } else if (newStatus === 'completed') {
          updates.manufacturing_completed_at = timestamp;
        } else if (newStatus === 'on_hold') {
          updates.manufacturing_hold_at = timestamp;
          updates.manufacturing_hold_reason = holdReason;
        }

        const { error: updateError } = await supabase
          .from('manufacturing_logs')
          .update(updates)
          .eq('lab_script_id', scriptId);

        if (updateError) throw updateError;
      }

      // Only update lab script status if it's not already completed
      if (labScript?.status !== 'completed') {
        const { error: labScriptError } = await supabase
          .from('lab_scripts')
          .update({ status: newStatus === 'completed' ? 'completed' : 'in_progress' })
          .eq('id', scriptId);

        if (labScriptError) throw labScriptError;
      }

      console.log("Manufacturing status updated successfully");
      toast({
        title: "Status Updated",
        description: `Manufacturing ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error("Error updating manufacturing status:", error);
      toast({
        title: "Error",
        description: "Failed to update manufacturing status",
        variant: "destructive"
      });
    }
  };

  const handleStart = async () => {
    await updateManufacturingStatus('in_progress');
    onStart();
  };

  const handleComplete = async () => {
    await updateManufacturingStatus('completed');
    onComplete();
  };

  const handleHold = async () => {
    if (holdReason.trim()) {
      await updateManufacturingStatus('on_hold', holdReason);
      setSavedHoldReason(holdReason);
      onHold();
      setShowReasonInput(false);
      setHoldReason("");
    }
  };

  const handleResume = async () => {
    await updateManufacturingStatus('in_progress');
    onResume();
  };

  if (status === 'pending') {
    return (
      <StartButton 
        scriptId={scriptId}
        onStart={handleStart}
        manufacturingType={manufacturingType}
      />
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
            className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
          >
            <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            Complete {manufacturingType}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReasonInput(true)}
            className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
          >
            <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            Hold {manufacturingType}
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
          onClick={handleResume}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <PlayCircle className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
          Resume {manufacturingType}
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