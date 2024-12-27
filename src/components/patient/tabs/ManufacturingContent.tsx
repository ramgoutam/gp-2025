import React, { useState } from "react";
import { LabScript } from "@/types/labScript";
import { Factory } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ManufacturingCard } from "../manufacturing/ManufacturingCard";
import { ManufacturingControls } from "../manufacturing/ManufacturingControls";

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
  const [pausedSinteringScripts, setPausedSinteringScripts] = useState<{ [key: string]: boolean }>({});

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
    setActiveScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    setPausedScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
    setCompletedScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
    setSinteringScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
    console.log('Starting manufacturing process for script:', scriptId);
  };

  const handlePause = (scriptId: string) => {
    setPausedScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    console.log('Pausing manufacturing process for script:', scriptId);
  };

  const handleHold = (scriptId: string) => {
    setPausedScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    console.log('Holding manufacturing process for script:', scriptId);
  };

  const handleResume = (scriptId: string) => {
    setPausedScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
    console.log('Resuming manufacturing process for script:', scriptId);
  };

  const handleComplete = (scriptId: string) => {
    setCompletedScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    console.log('Completing manufacturing process for script:', scriptId);
  };

  const handleStartSintering = (scriptId: string) => {
    setSinteringScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    setPausedSinteringScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
    console.log('Starting sintering process for script:', scriptId);
  };

  const handlePauseSintering = (scriptId: string) => {
    setPausedSinteringScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    console.log('Pausing sintering process for script:', scriptId);
  };

  const handleHoldSintering = (scriptId: string) => {
    setPausedSinteringScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    console.log('Holding sintering process for script:', scriptId);
  };

  const handleResumeSintering = (scriptId: string) => {
    setPausedSinteringScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
    console.log('Resuming sintering process for script:', scriptId);
  };

  const handleCompleteSintering = (scriptId: string) => {
    setSinteringScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
    setPausedSinteringScripts(prev => ({
      ...prev,
      [scriptId]: false
    }));
    setCompletedScripts(prev => ({
      ...prev,
      [scriptId]: true
    }));
    console.log('Completing sintering process for script:', scriptId);
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
              onStart={() => handleStartManufacturing(script.id)}
              onPause={() => handlePause(script.id)}
              onHold={() => handleHold(script.id)}
              onResume={() => handleResume(script.id)}
              onComplete={() => handleComplete(script.id)}
              onStartSintering={() => handleStartSintering(script.id)}
              onPauseSintering={() => handlePauseSintering(script.id)}
              onHoldSintering={() => handleHoldSintering(script.id)}
              onResumeSintering={() => handleResumeSintering(script.id)}
              onCompleteSintering={() => handleCompleteSintering(script.id)}
            />
          </ManufacturingCard>
        ))}
      </div>
    </div>
  );
};