import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { Check, Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ManufacturingCardProps {
  script: LabScript;
  children?: React.ReactNode;
}

type StepStatus = 'completed' | 'current' | 'upcoming';
type Step = { name: string; status: StepStatus };

export const ManufacturingCard = ({ script, children }: ManufacturingCardProps) => {
  const [steps, setSteps] = useState<Step[]>([
    { name: 'Milling', status: 'upcoming' },
    { name: 'Sintering', status: 'upcoming' },
    { name: 'Miyo', status: 'upcoming' }
  ]);

  useEffect(() => {
    // Initialize steps based on script status
    if (script.status === 'completed') {
      setSteps(steps.map(step => ({ ...step, status: 'completed' as StepStatus })));
    } else {
      const currentStepIndex = steps.findIndex(step => step.status === 'current');
      if (currentStepIndex === -1) {
        setSteps(prev => [
          { ...prev[0], status: 'current' },
          ...prev.slice(1)
        ]);
      }
    }
  }, [script.status]);

  const getStepIcon = (step: Step) => {
    switch (step.status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'current':
        return <Play className="h-4 w-4 text-blue-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card key={script.id} className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Manufacturing Source</p>
            <p className="font-medium">{script.manufacturingSource}</p>
          </div>
          <div>
            <p className="text-gray-500">Manufacturing Type</p>
            <p className="font-medium">{script.manufacturingType}</p>
          </div>
          <div>
            <p className="text-gray-500">Material</p>
            <p className="font-medium">{script.material || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Shade</p>
            <p className="font-medium">{script.shade || 'N/A'}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div 
                key={step.name}
                className={cn(
                  "flex items-center gap-2",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <div className="flex items-center gap-2">
                  {getStepIcon(step)}
                  <span className={cn(
                    "text-sm font-medium",
                    step.status === 'completed' && "text-green-600",
                    step.status === 'current' && "text-blue-600",
                    step.status === 'upcoming' && "text-gray-400"
                  )}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-[1px] bg-gray-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};