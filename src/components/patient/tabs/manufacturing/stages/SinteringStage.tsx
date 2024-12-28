import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, CheckCircle, Pause, PlayCircle } from "lucide-react";

interface SinteringStageProps {
  scriptId: string;
  status: string;
  onStart: () => void;
  onComplete: () => void;
  onHold: () => void;
  onResume: () => void;
}

export const SinteringStage = ({
  status,
  onStart,
  onComplete,
  onHold,
  onResume
}: SinteringStageProps) => {
  const [holdReason, setHoldReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const handleHold = () => {
    if (holdReason.trim()) {
      onHold();
      setShowReasonInput(false);
      setHoldReason("");
    }
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
      <div className="flex flex-col gap-2 animate-fade-in">
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
        {holdReason && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md border border-yellow-200">
            On hold: {holdReason}
          </div>
        )}
      </div>
    );
  }

  return null;
};