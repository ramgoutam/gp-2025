import { Button } from "@/components/ui/button";
import { Play, Check, ChevronRight } from "lucide-react";
import { InitialStage } from "./stages/InitialStage";
import { useState } from "react";

interface ManufacturingControlsProps {
  manufacturingType: string;
  isActive: boolean;
  onStart: () => void;
  onComplete: () => void;
}

export const ManufacturingControls = ({
  manufacturingType,
  isActive,
  onStart,
  onComplete,
}: ManufacturingControlsProps) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  console.log("Manufacturing Controls State:", { isActive, completedSteps });

  if (!isActive) {
    return <InitialStage manufacturingType={manufacturingType} onStart={onStart} />;
  }

  const handleStepComplete = (step: string) => {
    if (!completedSteps.includes(step)) {
      const newCompletedSteps = [...completedSteps, step];
      setCompletedSteps(newCompletedSteps);
      
      if (newCompletedSteps.length === 3) {
        onComplete();
      }
    }
  };

  const isStepCompleted = (step: string) => completedSteps.includes(step);
  const areAllStepsCompleted = completedSteps.length === 3;

  if (areAllStepsCompleted) {
    return (
      <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-2 rounded-md">
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">Manufacturing Complete</span>
      </div>
    );
  }

  const getStepStyle = (step: string) => {
    const baseStyle = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200";
    
    if (isStepCompleted(step)) {
      return `${baseStyle} bg-green-500/10 text-green-600`;
    }
    
    const isDisabled = (step === 'sintering' && !isStepCompleted('milling')) || 
                      (step === 'miyo' && !isStepCompleted('sintering'));
    
    return isDisabled 
      ? `${baseStyle} bg-gray-100 text-gray-400 cursor-not-allowed` 
      : `${baseStyle} bg-primary/10 text-primary hover:bg-primary/20`;
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1.5">
        <button
          className={getStepStyle('milling')}
          onClick={() => handleStepComplete('milling')}
          disabled={isStepCompleted('milling')}
        >
          {isStepCompleted('milling') ? (
            <Check className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{manufacturingType === 'Milling' ? 'Milling' : 'Printing'}</span>
        </button>

        <button
          className={getStepStyle('sintering')}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling') || isStepCompleted('sintering')}
        >
          {isStepCompleted('sintering') ? (
            <Check className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>Sintering</span>
        </button>

        <button
          className={getStepStyle('miyo')}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering') || isStepCompleted('miyo')}
        >
          {isStepCompleted('miyo') ? (
            <Check className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>MIYO</span>
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Complete steps in order: {manufacturingType === 'Milling' ? 'Milling' : 'Printing'} → Sintering → MIYO
      </div>
    </div>
  );
};