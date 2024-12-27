import { Button } from "@/components/ui/button";
import { Play, Check, CircleCheck, ArrowRight } from "lucide-react";
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
      <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium px-6 py-4 rounded-xl shadow-lg animate-fade-in transform hover:scale-105 transition-all duration-300">
        <CircleCheck className="w-6 h-6 animate-scale-in" />
        <span className="text-lg">Manufacturing Complete - Ready to Insert</span>
      </div>
    );
  }

  const getStepStyle = (step: string) => {
    const baseStyle = "relative flex flex-col items-center gap-2 p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1";
    const completedStyle = "bg-gradient-to-br from-green-500 to-emerald-500 text-white";
    const pendingStyle = "bg-gradient-to-br from-primary-500 to-primary-600 text-white";
    const disabledStyle = "opacity-50 cursor-not-allowed hover:transform-none";
    
    if (isStepCompleted(step)) {
      return `${baseStyle} ${completedStyle}`;
    }
    
    const isDisabled = (step === 'sintering' && !isStepCompleted('milling')) || 
                      (step === 'miyo' && !isStepCompleted('sintering'));
    
    return `${baseStyle} ${pendingStyle} ${isDisabled ? disabledStyle : ''}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-3 gap-6">
        <button
          className={getStepStyle('milling')}
          onClick={() => handleStepComplete('milling')}
          disabled={isStepCompleted('milling')}
        >
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            {isStepCompleted('milling') ? (
              <CircleCheck className="w-8 h-8 animate-scale-in" />
            ) : (
              <Play className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            )}
            <span className="text-lg font-medium">
              {manufacturingType === 'Milling' ? 'Milling' : 'Printing'}
            </span>
            {!isStepCompleted('milling') && (
              <span className="text-sm opacity-80">Click to complete</span>
            )}
          </div>
          {isStepCompleted('milling') && (
            <ArrowRight className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 z-20" />
          )}
        </button>

        <button
          className={getStepStyle('sintering')}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling') || isStepCompleted('sintering')}
        >
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            {isStepCompleted('sintering') ? (
              <CircleCheck className="w-8 h-8 animate-scale-in" />
            ) : (
              <Play className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            )}
            <span className="text-lg font-medium">Sintering</span>
            {!isStepCompleted('sintering') && isStepCompleted('milling') && (
              <span className="text-sm opacity-80">Click to complete</span>
            )}
          </div>
          {isStepCompleted('sintering') && (
            <ArrowRight className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 z-20" />
          )}
        </button>

        <button
          className={getStepStyle('miyo')}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering') || isStepCompleted('miyo')}
        >
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            {isStepCompleted('miyo') ? (
              <CircleCheck className="w-8 h-8 animate-scale-in" />
            ) : (
              <Play className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            )}
            <span className="text-lg font-medium">MIYO</span>
            {!isStepCompleted('miyo') && isStepCompleted('sintering') && (
              <span className="text-sm opacity-80">Click to complete</span>
            )}
          </div>
        </button>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-500">
          Complete steps in order: {manufacturingType === 'Milling' ? 'Milling' : 'Printing'} → Sintering → MIYO
        </div>
      </div>
    </div>
  );
};