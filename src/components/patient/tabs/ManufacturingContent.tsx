import React from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";

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
          <ManufacturingCard
            key={script.id}
            title={`${script.applianceType || 'N/A'} | ${script.upperDesignName || 'No upper appliance'} | ${script.lowerDesignName || 'No lower appliance'}`}
            count={1}
            icon={Factory}
            color="text-blue-600"
            bgColor="bg-blue-100"
            progressColor="bg-blue-500"
            scripts={[script]}
            onStart={() => console.log('Starting manufacturing process for script:', script.id)}
          />
        ))}
      </div>
    </div>
  );
};