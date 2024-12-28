import React from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts, patientData }: ManufacturingContentProps) => {
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
                <h3 className="font-semibold text-sm">
                  {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
                </h3>
                {script.manufacturingSource === 'Inhouse' && (
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => console.log('Starting manufacturing process for script:', script.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {getButtonText(script.manufacturingType || '')}
                  </Button>
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