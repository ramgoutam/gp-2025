import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { ProgressBar } from "@/components/patient/ProgressBar";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ManufacturingCardProps {
  script: LabScript;
  children: React.ReactNode;
}

type Step = {
  label: string;
  status: "completed" | "current" | "upcoming";
};

export const ManufacturingCard = ({ script, children }: ManufacturingCardProps) => {
  const { toast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps = [
    { 
      label: "Milling/Printing", 
      status: completedSteps.includes("milling") ? "completed" : "current" 
    },
    { 
      label: "Sintering", 
      status: completedSteps.includes("sintering") 
        ? "completed" 
        : completedSteps.includes("milling") 
          ? "current" 
          : "upcoming" 
    },
    { 
      label: "MIYO", 
      status: completedSteps.includes("miyo") 
        ? "completed" 
        : completedSteps.includes("sintering") 
          ? "current" 
          : "upcoming" 
    }
  ] as const satisfies Step[];

  const handleStepComplete = async (stepKey: string) => {
    try {
      if (stepKey === "sintering" && !completedSteps.includes("milling")) return;
      if (stepKey === "miyo" && !completedSteps.includes("sintering")) return;

      const newCompletedSteps = [...completedSteps, stepKey];
      setCompletedSteps(newCompletedSteps);

      if (newCompletedSteps.length === 3) {
        const { error } = await supabase
          .from('lab_scripts')
          .update({ status: 'completed' })
          .eq('id', script.id);

        if (error) throw error;
      }

      toast({
        title: "Step completed",
        description: `${stepKey.charAt(0).toUpperCase() + stepKey.slice(1)} step marked as complete`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update step status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card key={script.id} className="p-3">
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-2">
            {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
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
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="flex flex-col space-y-2">
            {steps.map((step, index) => {
              const stepKey = step.label.toLowerCase().split('/')[0];
              if (step.status === "current") {
                return (
                  <Button
                    key={stepKey}
                    size="sm"
                    variant="outline"
                    className="bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100 hover:border-primary-300 transition-all duration-300 min-w-[120px] justify-start"
                    onClick={() => handleStepComplete(stepKey)}
                  >
                    {completedSteps.includes(stepKey) ? (
                      <Check className="w-4 h-4 mr-2 text-primary-500" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2 text-primary-500" />
                    )}
                    Complete {step.label}
                  </Button>
                );
              }
              return null;
            })}
          </div>
          <ProgressBar steps={steps} />
        </div>
      </div>
    </Card>
  );
};