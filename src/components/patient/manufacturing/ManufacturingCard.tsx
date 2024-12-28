import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Edit2 } from "lucide-react";
import { ProgressBar } from "@/components/patient/ProgressBar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ManufacturingCardProps {
  script: any; // Replace with actual type
  onUpdate?: () => void;
}

export const ManufacturingCard = ({ script, onUpdate }: ManufacturingCardProps) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const { toast } = useToast();
  const [editingPrevious, setEditingPrevious] = useState(false);

  const steps = [
    { label: "Step 1", status: "current" },
    { label: "Step 2", status: "upcoming" },
    { label: "Step 3", status: "upcoming" },
  ]; // Define your steps here

  const handleStepComplete = async (stepKey: string) => {
    try {
      console.log("Completing step:", stepKey);
      const updatedSteps = [...completedSteps, stepKey];
      setCompletedSteps(updatedSteps);
      
      const newStatus = updatedSteps.length === steps.length ? "completed" : "in_progress";
      
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id);

      if (error) throw error;

      toast({
        title: "Step Completed",
        description: `${stepKey} has been marked as complete`
      });

      onUpdate?.();
    } catch (error) {
      console.error("Error completing step:", error);
      toast({
        title: "Error",
        description: "Failed to complete step",
        variant: "destructive"
      });
    }
  };

  const toggleEditPrevious = () => {
    setEditingPrevious(!editingPrevious);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Manufacturing Progress</h3>
            <p className="text-sm text-gray-500">Track the manufacturing stages</p>
          </div>
          {completedSteps.length > 0 && !editingPrevious && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEditPrevious}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300"
            >
              <Edit2 className="w-4 h-4 mr-2 text-blue-500" />
              Edit Previous Status
            </Button>
          )}
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="flex flex-col space-y-2">
            {steps.map((step, index) => {
              const stepKey = step.label.toLowerCase().split('/')[0];
              const isCompleted = completedSteps.includes(stepKey);
              
              if ((step.status === "current" || (editingPrevious && isCompleted))) {
                return (
                  <Button
                    key={stepKey}
                    size="sm"
                    variant="outline"
                    className="bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100 hover:border-primary-300 transition-all duration-300 min-w-[120px] justify-start"
                    onClick={() => handleStepComplete(stepKey)}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 mr-2 text-primary-500" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2 text-primary-500" />
                    )}
                    {isCompleted ? `Update ${step.label}` : `Complete ${step.label}`}
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
