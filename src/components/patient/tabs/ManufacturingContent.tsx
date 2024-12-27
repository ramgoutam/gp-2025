import React from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const getManufacturingStatus = (script: LabScript) => {
    console.log("Checking manufacturing status for script:", script);
    
    // If lab script is not complete
    if (script.status !== 'completed') {
      return "Design Pending";
    }
    
    // If lab script is complete but design report card is not
    if (script.status === 'completed' && (!script.designInfoStatus || script.designInfoStatus !== 'completed')) {
      return "Design report-card pending";
    }
    
    // If design report card is completed
    if (script.designInfoStatus === 'completed') {
      return `${script.manufacturingType} pending`;
    }

    return "Status unknown";
  };

  const getStatusColor = (status: string) => {
    if (status === "Design Pending") {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    if (status === "Design report-card pending") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (status.includes("pending")) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

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
        {manufacturingScripts.map((script) => {
          const status = getManufacturingStatus(script);
          console.log("Manufacturing status for script:", script.id, status);
          
          return (
            <Card key={script.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(status)} px-3 py-1`}
                  >
                    {status}
                  </Badge>
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
          );
        })}
      </div>
    </div>
  );
};