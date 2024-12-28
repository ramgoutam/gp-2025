import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { ProgressBar } from "@/components/patient/ProgressBar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ManufacturingCardProps {
  script: LabScript;
  children: React.ReactNode;
}

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
      // Only allow completing steps in order
      if (stepKey === "sintering" && !completedSteps.includes("milling")) return;
      if (stepKey === "miyo" && !completedSteps.includes("sintering")) return;

      const newCompletedSteps = [...completedSteps, stepKey];
      setCompletedSteps(newCompletedSteps);

      // Update lab script status if all steps are completed
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
    <Card key={script.id} className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-semibold">
          {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
        </h3>
        <div className="w-64">
          <ProgressBar steps={steps} />
          <div className="flex gap-2 mt-2 justify-end">
            {steps.map((step, index) => {
              const stepKey = step.label.toLowerCase().split('/')[0];
              if (step.status === "current") {
                return (
                  <Button
                    key={stepKey}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => handleStepComplete(stepKey)}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Complete {step.label}
                  </Button>
                );
              }
              return null;
            })}
          </div>
        </div>
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
    </Card>
  );
};