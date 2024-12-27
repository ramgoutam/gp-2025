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
      <div className="flex items-center gap-3 text-green-600 font-medium bg-green-50 px-6 py-4 rounded-xl shadow-sm animate-fade-in">
        <Check className="w-6 h-6 animate-scale-in" />
        <span className="text-lg">Completed - Ready to Insert</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ToggleGroup type="single" className="flex flex-wrap gap-4">
        <ToggleGroupItem 
          value="milling" 
          className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isStepCompleted('milling') 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200/50' 
              : 'bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-primary-200/50'
          } group`}
          onClick={() => handleStepComplete('milling')}
        >
          {isStepCompleted('milling') ? (
            <Check className="w-6 h-6 animate-scale-in group-hover:rotate-12 transition-transform" />
          ) : (
            <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
              : 'bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-primary-200/50'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:shadow-none group`}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling')}
        >
          {isStepCompleted('sintering') ? (
            <Check className="w-6 h-6 animate-scale-in group-hover:rotate-12 transition-transform" />
          ) : (
            <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          )}
          <span className="text-lg font-medium">Sintering</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="miyo" 
          className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isStepCompleted('miyo') 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200/50' 
              : 'bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-primary-200/50'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:shadow-none group`}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering')}
        >
          {isStepCompleted('miyo') ? (
            <Check className="w-6 h-6 animate-scale-in group-hover:rotate-12 transition-transform" />
          ) : (
            <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          )}
          <span className="text-lg font-medium">MIYO</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};