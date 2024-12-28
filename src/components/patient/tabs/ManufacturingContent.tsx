import React, { useState } from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts, patientData }: ManufacturingContentProps) => {
  const [manufacturingStatus, setManufacturingStatus] = useState<{ [key: string]: 'not_started' | 'in_progress' | 'completed' }>({});
  const [sinteringStatus, setSinteringStatus] = useState<{ [key: string]: 'not_started' | 'in_progress' | 'completed' }>({});
  const [miyoStatus, setMiyoStatus] = useState<{ [key: string]: 'not_started' | 'in_progress' | 'completed' }>({});
  
  const manufacturingScripts = labScripts.filter(script => 
    script.manufacturingSource && script.manufacturingType
  );

  const getButtonText = (manufacturingType: string) => {
    switch (manufacturingType) {
      case 'Milling':
        return 'Start Milling';
      case 'Printing':
        return 'Start Printing';
      default:
        return 'Start';
    }
  };

  const handleStartClick = (scriptId: string) => {
    console.log('Starting manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteManufacturing = (scriptId: string) => {
    console.log('Completing manufacturing process for script:', scriptId);
    setManufacturingStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
  };

  const handleStartSintering = (scriptId: string) => {
    console.log('Starting sintering process for script:', scriptId);
    setSinteringStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteSintering = (scriptId: string) => {
    console.log('Completing sintering process for script:', scriptId);
    setSinteringStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
  };

  const handleStartMiyo = (scriptId: string) => {
    console.log('Starting Miyo process for script:', scriptId);
    setMiyoStatus(prev => ({ ...prev, [scriptId]: 'in_progress' }));
  };

  const handleCompleteMiyo = (scriptId: string) => {
    console.log('Completing Miyo process for script:', scriptId);
    setMiyoStatus(prev => ({ ...prev, [scriptId]: 'completed' }));
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
          <Card key={script.id} className="p-4 transition-all duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
                </h3>
                {script.manufacturingSource === 'Inhouse' && (
                  <div className="flex gap-2">
                    {!manufacturingStatus[script.id] && (
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                        onClick={() => handleStartClick(script.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {getButtonText(script.manufacturingType || '')}
                      </Button>
                    )}
                    {manufacturingStatus[script.id] === 'in_progress' && (
                      <Button 
                        className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                        onClick={() => handleCompleteManufacturing(script.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete {script.manufacturingType}
                      </Button>
                    )}
                    {manufacturingStatus[script.id] === 'completed' && !sinteringStatus[script.id] && (
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                        onClick={() => handleStartSintering(script.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Sintering
                      </Button>
                    )}
                    {sinteringStatus[script.id] === 'in_progress' && (
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                        onClick={() => handleCompleteSintering(script.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Sintering
                      </Button>
                    )}
                    {sinteringStatus[script.id] === 'completed' && !miyoStatus[script.id] && (
                      <Button 
                        className="bg-orange-500 hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                        onClick={() => handleStartMiyo(script.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Miyo
                      </Button>
                    )}
                    {miyoStatus[script.id] === 'in_progress' && (
                      <Button 
                        className="bg-orange-500 hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                        onClick={() => handleCompleteMiyo(script.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Miyo
                      </Button>
                    )}
                  </div>
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};