import React from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts, patientData }: ManufacturingContentProps) => {
  const { toast } = useToast();
  const manufacturingScripts = labScripts.filter(script => 
    script.manufacturingSource && script.manufacturingType
  );

  const getStepName = (stepNumber: number, script: LabScript) => {
    if (stepNumber === 1) return script.manufacturingType || 'Manufacturing';
    if (stepNumber === 2) return 'Sintering';
    return 'Miyo';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const updateManufacturingStep = async (scriptId: string, stepNumber: number, newStatus: string) => {
    console.log(`Updating manufacturing step ${stepNumber} to ${newStatus} for script ${scriptId}`);
    
    try {
      const columnName = `manufacturing_step_${stepNumber}_status`;
      
      // Update the specific step status
      const { error: updateError } = await supabase
        .from('lab_scripts')
        .update({ [columnName]: newStatus })
        .eq('id', scriptId);

      if (updateError) throw updateError;

      // If all steps are completed, update manufacturing_completed
      if (newStatus === 'completed') {
        const { data: script } = await supabase
          .from('lab_scripts')
          .select('manufacturing_step_1_status, manufacturing_step_2_status, manufacturing_step_3_status')
          .eq('id', scriptId)
          .single();

        if (script && 
            script.manufacturing_step_1_status === 'completed' &&
            script.manufacturing_step_2_status === 'completed' &&
            script.manufacturing_step_3_status === 'completed') {
          
          const { error: completionError } = await supabase
            .from('lab_scripts')
            .update({ manufacturing_completed: true })
            .eq('id', scriptId);

          if (completionError) throw completionError;
        }
      }

      toast({
        title: "Success",
        description: `Manufacturing step ${stepNumber} updated successfully`,
      });
    } catch (error) {
      console.error('Error updating manufacturing step:', error);
      toast({
        title: "Error",
        description: "Failed to update manufacturing step",
        variant: "destructive",
      });
    }
  };

  const renderManufacturingSteps = (script: LabScript) => {
    return (
      <div className="flex items-center gap-4 mt-2">
        {[1, 2, 3].map((stepNumber) => {
          const stepStatus = script[`manufacturingStep${stepNumber}Status` as keyof LabScript] as string || 'pending';
          const stepName = getStepName(stepNumber, script);
          
          return (
            <div key={stepNumber} className="flex items-center gap-2">
              <span className="text-sm font-medium">{stepName}:</span>
              <select
                className="text-sm border rounded px-2 py-1"
                value={stepStatus}
                onChange={(e) => updateManufacturingStep(script.id, stepNumber, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          );
        })}
      </div>
    );
  };

  if (manufacturingScripts.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center gap-3">
          <Factory className="w-10 h-10 text-gray-400" />
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">No Manufacturing Data</h3>
            <p className="text-sm text-gray-500">
              There are no lab scripts with manufacturing information for {patientData.firstName} {patientData.lastName}.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {manufacturingScripts.map((script) => (
          <Card key={script.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
                </h3>
                {script.manufacturingCompleted && (
                  <Badge className="bg-green-500">Manufacturing Completed</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Manufacturing Source</p>
                  <p className="font-medium">{script.manufacturingSource}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Manufacturing Type</p>
                  <p className="font-medium">{script.manufacturingType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Material</p>
                  <p className="font-medium">{script.material || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Shade</p>
                  <p className="font-medium">{script.shade || 'N/A'}</p>
                </div>
              </div>

              {renderManufacturingSteps(script)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};