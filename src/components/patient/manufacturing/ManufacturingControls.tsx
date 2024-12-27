import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, Flame, AlertCircle, Check } from "lucide-react";

interface ManufacturingControlsProps {
  manufacturingType: string;
  isActive: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  isSintering: boolean;
  isMiyo: boolean;
  onStart: () => void;
  onPause: () => void;
  onHold: () => void;
  onResume: () => void;
  onComplete: () => void;
  onStartSintering: () => void;
  onPauseSintering: () => void;
  onHoldSintering: () => void;
  onResumeSintering: () => void;
  onCompleteSintering: () => void;
  onStartMiyo: () => void;
  onCompleteMiyo: () => void;
  onReadyToInsert: () => void;
}

export const ManufacturingControls = ({
  manufacturingType,
  isActive,
  isPaused,
  isCompleted,
  isSintering,
  isMiyo,
  onStart,
  onPause,
  onHold,
  onResume,
  onComplete,
  onStartSintering,
  onPauseSintering,
  onHoldSintering,
  onResumeSintering,
  onCompleteSintering,
  onStartMiyo,
  onCompleteMiyo,
  onReadyToInsert,
}: ManufacturingControlsProps) => {
  console.log("Manufacturing Controls State:", { 
    isActive, 
    isPaused, 
    isCompleted, 
    isSintering,
    isMiyo 
  });

  // Initial state - Start Printing/Milling
  if (!isActive && !isPaused && !isCompleted) {
    return (
      <Button 
        className="bg-primary hover:bg-primary/90"
        onClick={onStart}
      >
        <Play className="w-4 h-4 mr-2" />
        {manufacturingType === 'Milling' ? 'Start Milling' : 'Start Printing'}
      </Button>
    );
  }

  // Paused state during Printing/Milling
  if (isPaused && !isSintering && !isMiyo) {
    return (
      <Button 
        variant="outline"
        className="hover:bg-primary/5 group animate-fade-in"
        onClick={onResume}
      >
        <Play className="w-4 h-4 mr-2 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
        {manufacturingType === 'Milling' ? 'Resume Milling' : 'Resume Printing'}
      </Button>
    );
  }

  // Active Printing/Milling state
  if (isActive && !isCompleted && !isSintering && !isMiyo) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="hover:bg-yellow-50 text-yellow-600 border-yellow-200 group"
          onClick={onPause}
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
        <Button 
          variant="outline"
          className="hover:bg-red-50 text-red-600 border-red-200 group"
          onClick={onHold}
        >
          <StopCircle className="w-4 h-4 mr-2" />
          Hold
        </Button>
        <Button 
          variant="outline"
          className="hover:bg-orange-50 text-orange-600 border-orange-200"
          onClick={onComplete}
        >
          <Flame className="w-4 h-4 mr-2" />
          Complete {manufacturingType}
        </Button>
      </div>
    );
  }

  // After Printing/Milling completed, before Sintering
  if (isCompleted && !isSintering && !isMiyo) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="hover:bg-blue-50 text-blue-600 border-blue-200 group"
          onClick={onStart}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Edit {manufacturingType} Status
        </Button>
        <Button 
          variant="outline"
          className="hover:bg-orange-50 text-orange-600 border-orange-200"
          onClick={onStartSintering}
        >
          <Flame className="w-4 h-4 mr-2" />
          Start Sintering
        </Button>
      </div>
    );
  }

  // During Sintering
  if (isSintering && !isMiyo) {
    if (isPaused) {
      return (
        <Button 
          variant="outline"
          className="hover:bg-primary/5 group animate-fade-in"
          onClick={onResumeSintering}
        >
          <Play className="w-4 h-4 mr-2 text-primary" />
          Resume Sintering
        </Button>
      );
    }
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="hover:bg-yellow-50 text-yellow-600 border-yellow-200 group"
          onClick={onPauseSintering}
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause Sintering
        </Button>
        <Button 
          variant="outline"
          className="hover:bg-red-50 text-red-600 border-red-200 group"
          onClick={onHoldSintering}
        >
          <StopCircle className="w-4 h-4 mr-2" />
          Hold Sintering
        </Button>
        <Button 
          variant="outline"
          className="hover:bg-green-50 text-green-600 border-green-200"
          onClick={onCompleteSintering}
        >
          <Check className="w-4 h-4 mr-2" />
          Complete Sintering
        </Button>
      </div>
    );
  }

  // After Sintering completed, before Miyo
  if (isCompleted && !isMiyo) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="hover:bg-blue-50 text-blue-600 border-blue-200 group"
          onClick={onStartSintering}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Edit Sintering Status
        </Button>
        <Button 
          variant="outline"
          className="hover:bg-orange-50 text-orange-600 border-orange-200"
          onClick={onStartMiyo}
        >
          <Flame className="w-4 h-4 mr-2" />
          Start Miyo
        </Button>
      </div>
    );
  }

  // During Miyo
  if (isMiyo) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="hover:bg-blue-50 text-blue-600 border-blue-200 group"
          onClick={onStartMiyo}
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Edit Miyo Status
        </Button>
        <Button 
          variant="outline"
          className="hover:bg-green-50 text-green-600 border-green-200"
          onClick={onCompleteMiyo}
        >
          <Check className="w-4 h-4 mr-2" />
          Complete Miyo
        </Button>
      </div>
    );
  }

  // After Miyo completed, Ready to Insert
  if (isCompleted) {
    return (
      <Button 
        variant="outline"
        className="hover:bg-green-50 text-green-600 border-green-200"
        onClick={onReadyToInsert}
      >
        <Check className="w-4 h-4 mr-2" />
        Ready to Insert
      </Button>
    );
  }

  return null;
};