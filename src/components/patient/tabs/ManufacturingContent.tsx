import React, { useState } from "react";
import { LabScript } from "@/types/labScript";
import { Factory } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ManufacturingCard } from "../manufacturing/ManufacturingCard";
import { ManufacturingControls } from "../manufacturing/ManufacturingControls";
import { useToast } from "@/hooks/use-toast";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts, patientData }: ManufacturingContentProps) => {
  const [activeScripts, setActiveScripts] = useState<{ [key: string]: boolean }>({});
  const [pausedScripts, setPausedScripts] = useState<{ [key: string]: boolean }>({});
  const [completedScripts, setCompletedScripts] = useState<{ [key: string]: boolean }>({});
  const [sinteringScripts, setSinteringScripts] = useState<{ [key: string]: boolean }>({});
  const [miyoScripts, setMiyoScripts] = useState<{ [key: string]: boolean }>({});
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

  // Keeping these handlers for state management, but they won't be exposed in the UI
  const handlePause = (scriptId: string) => {
    console.log('Pausing manufacturing for script:', scriptId);
    setPausedScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
  };

  const handleHold = (scriptId: string) => {
    console.log('Holding manufacturing for script:', scriptId);
    setPausedScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
  };

  const handleResume = (scriptId: string) => {
    console.log('Resuming manufacturing for script:', scriptId);
    setPausedScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {manufacturingScripts.map((script) => (
          <ManufacturingCard key={script.id} script={script}>
            <ManufacturingControls
              manufacturingType={script.manufacturingType || ''}
              isActive={activeScripts[script.id]}
              isPaused={pausedScripts[script.id]}
              isCompleted={completedScripts[script.id]}
              isSintering={sinteringScripts[script.id]}
              isMiyo={miyoScripts[script.id]}
              onStart={() => handleStartManufacturing(script.id)}
              onPause={() => handlePause(script.id)}
              onHold={() => handleHold(script.id)}
              onResume={() => handleResume(script.id)}
              onComplete={() => {}}
              onStartSintering={() => {}}
              onCompleteSintering={() => {}}
              onStartMiyo={() => {}}
              onCompleteMiyo={() => {}}
              onReadyToInsert={() => {}}
            />
          </ManufacturingCard>
        ))}
      </div>
    </div>
  );
};
