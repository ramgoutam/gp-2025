import React, { useState } from "react";
import { LabScript } from "@/types/labScript";
import { Factory } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ManufacturingCard } from "../manufacturing/ManufacturingCard";
import { ManufacturingControls } from "../manufacturing/ManufacturingControls";
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
  const [activeScripts, setActiveScripts] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const manufacturingScripts = labScripts.filter(script => 
    script.manufacturingSource && script.manufacturingType
  );

  if (manufacturingScripts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <Factory className="w-12 h-12 text-gray-400" />
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">No Manufacturing Data</h3>
            <p className="text-sm text-gray-500">
              There are no lab scripts with manufacturing information for {patientData.firstName} {patientData.lastName}.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const handleStartManufacturing = (scriptId: string) => {
    console.log('Starting manufacturing for script:', scriptId);
    setActiveScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    toast({
      title: "Manufacturing Started",
      description: "The manufacturing process has been initiated.",
    });
  };

  const handleManufacturingComplete = async (scriptId: string) => {
    console.log('Manufacturing completed for script:', scriptId);
    
    try {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: 'completed' })
        .eq('id', scriptId);

      if (error) throw error;

      toast({
        title: "Manufacturing Completed",
        description: "The item is now ready to insert.",
      });
    } catch (error) {
      console.error('Error updating lab script status:', error);
      toast({
        title: "Error",
        description: "Failed to update manufacturing status.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {manufacturingScripts.map((script) => (
          <ManufacturingCard key={script.id} script={script}>
            <ManufacturingControls
              manufacturingType={script.manufacturingType || ''}
              isActive={activeScripts[script.id]}
              onStart={() => handleStartManufacturing(script.id)}
              onComplete={() => handleManufacturingComplete(script.id)}
            />
          </ManufacturingCard>
        ))}
      </div>
    </div>
  );
};