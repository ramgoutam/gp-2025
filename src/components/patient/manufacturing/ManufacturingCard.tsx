import React from "react";
import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";

interface ManufacturingCardProps {
  script: LabScript;
  children: React.ReactNode;
}

export const ManufacturingCard = ({ script, children }: ManufacturingCardProps) => {
  return (
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
          {children}
        </div>
      </div>
    </Card>
  );
};