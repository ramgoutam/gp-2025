import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, ThumbsDown, ThumbsUp } from "lucide-react";

interface InspectionStageProps {
  scriptId: string;
  status: string;
  onStart: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const InspectionStage = ({
  status,
  onStart,
  onApprove,
  onReject
}: InspectionStageProps) => {
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  if (status === 'pending') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onStart}
        className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
      >
        <Search className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
        Start Inspection
      </Button>
    );
  }

  if (status === 'in_progress') {
    return (
      <div className="flex gap-2 animate-fade-in">
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
        >
          <ThumbsUp className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Pass Inspection
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
        >
          <ThumbsDown className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Fail Inspection
        </Button>
      </div>
    );
  }

  return null;
};