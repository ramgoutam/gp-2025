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
      <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg shadow-md animate-fade-in">
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">Manufacturing Complete</span>
      </div>
    );
  }

  const getStepStyle = (step: string) => {
    const baseStyle = "flex items-center justify-between w-full px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium";
    const completedStyle = "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    const pendingStyle = "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700";
    const disabledStyle = "opacity-50 cursor-not-allowed hover:transform-none bg-gray-100 text-gray-400";
    
    if (isStepCompleted(step)) {
      return `${baseStyle} ${completedStyle}`;
    }
    
    const isDisabled = (step === 'sintering' && !isStepCompleted('milling')) || 
                      (step === 'miyo' && !isStepCompleted('sintering'));
    
    return `${baseStyle} ${isDisabled ? disabledStyle : pendingStyle}`;
  };

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex flex-col gap-2">
        <button
          className={getStepStyle('milling')}
          onClick={() => handleStepComplete('milling')}
          disabled={isStepCompleted('milling')}
        >
          <div className="flex items-center gap-2">
            {isStepCompleted('milling') ? (
              <Check className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{manufacturingType === 'Milling' ? 'Milling' : 'Printing'}</span>
          </div>
          {!isStepCompleted('milling') && (
            <ChevronRight className="w-4 h-4 opacity-75" />
          )}
        </button>

        <button
          className={getStepStyle('sintering')}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling') || isStepCompleted('sintering')}
        >
          <div className="flex items-center gap-2">
            {isStepCompleted('sintering') ? (
              <Check className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>Sintering</span>
          </div>
          {isStepCompleted('milling') && !isStepCompleted('sintering') && (
            <ChevronRight className="w-4 h-4 opacity-75" />
          )}
        </button>

        <button
          className={getStepStyle('miyo')}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering') || isStepCompleted('miyo')}
        >
          <div className="flex items-center gap-2">
            {isStepCompleted('miyo') ? (
              <Check className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>MIYO</span>
          </div>
          {isStepCompleted('sintering') && !isStepCompleted('miyo') && (
            <ChevronRight className="w-4 h-4 opacity-75" />
          )}
        </button>
      </div>

      <div className="flex justify-center">
        <div className="text-xs text-gray-500">
          Complete steps in order: {manufacturingType === 'Milling' ? 'Milling' : 'Printing'} → Sintering → MIYO
        </div>
      </div>
    </div>
  );
};