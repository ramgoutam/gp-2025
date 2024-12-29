import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle } from "lucide-react";

interface StatusButtonsProps {
  status: string;
  onComplete: () => void;
  onHold: () => void;
  onResume: () => void;
  onStart: () => void;
  manufacturingType?: string;
}

export const StatusButtons = ({
  status,
  onComplete,
  onHold,
  onResume,
  onStart,
  manufacturingType = "Manufacturing"
}: StatusButtonsProps) => {
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
        Start {manufacturingType}
      </Button>
    );
  }

  if (status === 'in_progress') {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onComplete}
          className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
        >
          <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Complete {manufacturingType}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onHold}
          className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
        >
          <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Hold {manufacturingType}
        </Button>
      </div>
    );
  }

  if (status === 'on_hold') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onResume}
        className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
      >
        <PlayCircle className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
        Resume {manufacturingType}
      </Button>
    );
  }

  return null;
};