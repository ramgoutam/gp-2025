import React from "react";
import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";

interface TreatmentStatusProps {
  labScripts: LabScript[];
}

export const TreatmentStatusContent = ({ labScripts }: TreatmentStatusProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="text-center py-8">
          <p className="text-gray-500">No treatment status available</p>
        </div>
      </div>
    </Card>
  );
};