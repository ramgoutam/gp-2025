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
      <ToggleGroup type="single" className="flex gap-3">
        <ToggleGroupItem 
          value="milling" 
          className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-sm transition-all duration-300 ${
            isStepCompleted('milling') 
              ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 shadow-green-200' 
              : 'data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-primary/90 shadow-primary/10'
          }`}
          onClick={() => handleStepComplete('milling')}
        >
          {isStepCompleted('milling') && <Check className="w-5 h-5 animate-scale-in" />}
          <span className="text-base font-medium">
            {manufacturingType === 'Milling' ? 'Milling' : 'Printing'}
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="sintering" 
          className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-sm transition-all duration-300 ${
            isStepCompleted('sintering') 
              ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 shadow-green-200' 
              : 'data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-primary/90 shadow-primary/10'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling')}
        >
          {isStepCompleted('sintering') && <Check className="w-5 h-5 animate-scale-in" />}
          <span className="text-base font-medium">Sintering</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="miyo" 
          className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-sm transition-all duration-300 ${
            isStepCompleted('miyo') 
              ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105 shadow-green-200' 
              : 'data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-primary/90 shadow-primary/10'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering')}
        >
          {isStepCompleted('miyo') && <Check className="w-5 h-5 animate-scale-in" />}
          <span className="text-base font-medium">MIYO</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};