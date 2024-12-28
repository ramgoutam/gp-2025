import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, CheckCircle } from "lucide-react";

interface MiyoStageProps {
  scriptId: string;
  status: string;
  onStart: () => void;
  onComplete: () => void;
}

export const MiyoStage = ({
  status,
  onStart,
  onComplete
}: MiyoStageProps) => {
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  if (status === 'pending') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onStart}
        className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
      >
        <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
        Start Miyo
      </Button>
    );
  }

  if (status === 'in_progress') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onComplete}
        className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
      >
        <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
        Complete Miyo
      </Button>
    );
  }

  return null;
};