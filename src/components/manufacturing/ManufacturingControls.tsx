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
      <div className="flex items-center gap-3 text-green-600 font-medium bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 rounded-xl shadow-sm animate-fade-in border border-green-100">
        <Check className="w-6 h-6 animate-scale-in text-green-500" />
        <span className="text-lg">Completed - Ready to Insert</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ToggleGroup type="single" className="flex flex-wrap gap-4">
        <ToggleGroupItem 
          value="milling" 
          className={`group relative flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isStepCompleted('milling') 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200/50' 
              : 'bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-primary-200/50'
          }`}
          onClick={() => handleStepComplete('milling')}
        >
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isStepCompleted('milling') ? (
            <Check className="w-6 h-6 animate-scale-in group-hover:rotate-12 transition-transform duration-300" />
          ) : (
            <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          )}
          <span className="text-lg font-medium relative z-10">
            {manufacturingType === 'Milling' ? 'Milling' : 'Printing'}
          </span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="sintering" 
          className={`group relative flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isStepCompleted('sintering') 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200/50' 
              : 'bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-primary-200/50'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:shadow-none`}
          onClick={() => handleStepComplete('sintering')}
          disabled={!isStepCompleted('milling')}
        >
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isStepCompleted('sintering') ? (
            <Check className="w-6 h-6 animate-scale-in group-hover:rotate-12 transition-transform duration-300" />
          ) : (
            <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          )}
          <span className="text-lg font-medium relative z-10">Sintering</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="miyo" 
          className={`group relative flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
            isStepCompleted('miyo') 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200/50' 
              : 'bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-primary-200/50'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:shadow-none`}
          onClick={() => handleStepComplete('miyo')}
          disabled={!isStepCompleted('sintering')}
        >
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isStepCompleted('miyo') ? (
            <Check className="w-6 h-6 animate-scale-in group-hover:rotate-12 transition-transform duration-300" />
          ) : (
            <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          )}
          <span className="text-lg font-medium relative z-10">MIYO</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};