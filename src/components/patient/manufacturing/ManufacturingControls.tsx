import { Button } from "@/components/ui/button";
import { Play, Check } from "lucide-react";
import { InitialStage } from "./stages/InitialStage";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
      <div className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg animate-fade-in">
        <Check className="w-6 h-6 animate-bounce" />
        <span className="text-lg font-medium">Completed - Ready to Insert</span>
      </div>
    );
  }

  const getStepStyles = (step: string) => {
    const baseStyles = "relative flex items-center gap-2 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-lg font-medium";
    const completedStyles = "bg-gradient-to-r from-green-500 to-green-600 text-white";
    const activeStyles = "bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white";
    const disabledStyles = "bg-gray-100 text-gray-400 cursor-not-allowed hover:transform-none hover:shadow-lg";
    
    if (isStepCompleted(step)) return `${baseStyles} ${completedStyles}`;
    if (step === 'milling' || (step === 'sintering' && isStepCompleted('milling')) || (step === 'miyo' && isStepCompleted('sintering'))) {
      return `${baseStyles} ${activeStyles}`;
    }
    return `${baseStyles} ${disabledStyles}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <button
          className={getStepStyles('milling')}
          onClick={() => handleStepComplete('milling')}
          disabled={isStepCompleted('milling')}
        >
          {isStepCompleted('milling') ? (
            <Check className="w-6 h-6 animate-bounce" />
          ) : (
            <Play className="w-6 h-6 animate-pulse" />
          )}
          <span>{manufacturingType === 'Milling' ? 'Milling' : 'Printing'}</span>
          {!isStepCompleted('milling') && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm opacity-75">
              Click to complete
            </div>
          )}
        </button>

        <button
          className={getStepStyles('sintering')}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling') || isStepCompleted('sintering')}
        >
          {isStepCompleted('sintering') ? (
            <Check className="w-6 h-6 animate-bounce" />
          ) : (
            <Play className="w-6 h-6 animate-pulse" />
          )}
          <span>Sintering</span>
          {isStepCompleted('milling') && !isStepCompleted('sintering') && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm opacity-75">
              Click to complete
            </div>
          )}
        </button>

        <button
          className={getStepStyles('miyo')}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering') || isStepCompleted('miyo')}
        >
          {isStepCompleted('miyo') ? (
            <Check className="w-6 h-6 animate-bounce" />
          ) : (
            <Play className="w-6 h-6 animate-pulse" />
          )}
          <span>MIYO</span>
          {isStepCompleted('sintering') && !isStepCompleted('miyo') && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm opacity-75">
              Click to complete
            </div>
          )}
        </button>
      </div>
    </div>
  );
};