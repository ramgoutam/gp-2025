import React, { useState } from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory, Play, Pause, StopCircle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const handleStartSintering = (scriptId: string) => {
    console.log('Starting sintering process for script:', scriptId);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {manufacturingScripts.map((script) => (
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

              <div className="flex justify-end pt-4">
                {!activeScripts[script.id] ? (
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleStartManufacturing(script.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {script.manufacturingType === 'Milling' 
                      ? 'Start Milling' 
                      : script.manufacturingType === 'Printing' 
                      ? 'Start Printing' 
                      : 'Start'}
                  </Button>
                ) : pausedScripts[script.id] ? (
                  <Button 
                    variant="outline"
                    className="hover:bg-primary/5 group animate-fade-in"
                    onClick={() => handleResume(script.id)}
                  >
                    <PlayCircle className="w-4 h-4 mr-2 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
                    {script.manufacturingType === 'Milling' 
                      ? 'Resume Milling' 
                      : script.manufacturingType === 'Printing' 
                      ? 'Resume Printing' 
                      : 'Resume'}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="hover:bg-yellow-50 text-yellow-600 border-yellow-200"
                      onClick={() => handlePause(script.id)}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button 
                      variant="outline"
                      className="hover:bg-red-50 text-red-600 border-red-200"
                      onClick={() => handleHold(script.id)}
                    >
                      <StopCircle className="w-4 h-4 mr-2" />
                      Hold
                    </Button>
                    <Button 
                      variant="outline"
                      className="hover:bg-orange-50 text-orange-600 border-orange-200"
                      onClick={() => handleStartSintering(script.id)}
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      {script.manufacturingType === 'Milling' 
                        ? 'Complete Milling' 
                        : script.manufacturingType === 'Printing' 
                        ? 'Complete Printing' 
                        : 'Complete'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};