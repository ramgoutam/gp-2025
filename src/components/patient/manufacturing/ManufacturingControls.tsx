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
      <div className="flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg animate-fade-in">
        <Check className="w-7 h-7 animate-bounce" />
        <span className="text-xl font-semibold tracking-wide">
          Completed - Ready to Insert
        </span>
      </div>
    );
  }

  const getStepStyles = (step: string) => {
    const baseStyles = "relative flex items-center justify-between w-full px-8 py-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl";
    const iconBaseStyles = "w-6 h-6 transition-transform duration-300 group-hover:scale-110";
    
    if (isStepCompleted(step)) {
      return `${baseStyles} bg-gradient-to-br from-green-500 to-green-600 text-white`;
    }
    
    if (step === 'milling' || (step === 'sintering' && isStepCompleted('milling')) || (step === 'miyo' && isStepCompleted('sintering'))) {
      return `${baseStyles} bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white group`;
    }
    
    return `${baseStyles} bg-gray-100 text-gray-400 cursor-not-allowed hover:transform-none`;
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Milling/Printing Step */}
        <button
          className={getStepStyles('milling')}
          onClick={() => handleStepComplete('milling')}
          disabled={isStepCompleted('milling')}
        >
          <div className="flex items-center gap-3">
            {isStepCompleted('milling') ? (
              <Check className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 animate-pulse" />
            )}
            <span className="text-lg font-semibold tracking-wide">
              {manufacturingType === 'Milling' ? 'Milling' : 'Printing'}
            </span>
          </div>
          {!isStepCompleted('milling') && (
            <ChevronRight className="w-6 h-6 opacity-75 group-hover:translate-x-1 transition-transform duration-300" />
          )}
        </button>

        {/* Sintering Step */}
        <button
          className={getStepStyles('sintering')}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling') || isStepCompleted('sintering')}
        >
          <div className="flex items-center gap-3">
            {isStepCompleted('sintering') ? (
              <Check className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 animate-pulse" />
            )}
            <span className="text-lg font-semibold tracking-wide">
              Sintering
            </span>
          </div>
          {isStepCompleted('milling') && !isStepCompleted('sintering') && (
            <ChevronRight className="w-6 h-6 opacity-75 group-hover:translate-x-1 transition-transform duration-300" />
          )}
        </button>

        {/* MIYO Step */}
        <button
          className={getStepStyles('miyo')}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering') || isStepCompleted('miyo')}
        >
          <div className="flex items-center gap-3">
            {isStepCompleted('miyo') ? (
              <Check className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 animate-pulse" />
            )}
            <span className="text-lg font-semibold tracking-wide">
              MIYO
            </span>
          </div>
          {isStepCompleted('sintering') && !isStepCompleted('miyo') && (
            <ChevronRight className="w-6 h-6 opacity-75 group-hover:translate-x-1 transition-transform duration-300" />
          )}
        </button>
      </div>
    </div>
  );
};