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
      
      // If all steps are completed, trigger the onComplete callback
      if (newCompletedSteps.length === 3) {
        onComplete();
      }
    }
  };

  const isStepCompleted = (step: string) => completedSteps.includes(step);
  const areAllStepsCompleted = completedSteps.length === 3;

  if (areAllStepsCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium animate-fade-in">
        <Check className="w-5 h-5 animate-scale-in" />
        <span className="animate-fade-in">Completed - Ready to Insert</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <ToggleGroup type="single" className="flex flex-wrap gap-4">
        <ToggleGroupItem 
          value="milling" 
          className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isStepCompleted('milling') 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200/50' 
              : 'data-[state=on]:bg-gradient-to-r data-[state=on]:from-primary data-[state=on]:to-primary-600 data-[state=on]:text-white hover:bg-primary/90 shadow-primary/20'
          }`}
          onClick={() => handleStepComplete('milling')}
        >
          {isStepCompleted('milling') && (
            <Check className="w-6 h-6 animate-scale-in" />
          )}
          <span className="text-lg font-medium">
            {manufacturingType === 'Milling' ? 'Milling' : 'Printing'}
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="sintering" 
          className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isStepCompleted('sintering') 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200/50' 
              : 'data-[state=on]:bg-gradient-to-r data-[state=on]:from-primary data-[state=on]:to-primary-600 data-[state=on]:text-white hover:bg-primary/90 shadow-primary/20'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none`}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling')}
        >
          {isStepCompleted('sintering') && (
            <Check className="w-6 h-6 animate-scale-in" />
          )}
          <span className="text-lg font-medium">Sintering</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="miyo" 
          className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isStepCompleted('miyo') 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200/50' 
              : 'data-[state=on]:bg-gradient-to-r data-[state=on]:from-primary data-[state=on]:to-primary-600 data-[state=on]:text-white hover:bg-primary/90 shadow-primary/20'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none`}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering')}
        >
          {isStepCompleted('miyo') && (
            <Check className="w-6 h-6 animate-scale-in" />
          )}
          <span className="text-lg font-medium">MIYO</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};