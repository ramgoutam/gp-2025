import React from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {manufacturingScripts.map((script) => (
          <Card key={script.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Lab Script #{script.requestNumber}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  script.status === 'completed' ? 'bg-green-100 text-green-800' :
                  script.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {script.status.charAt(0).toUpperCase() + script.status.slice(1)}
                </span>
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};