import React from "react";
import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";

interface TreatmentStatusProps {
  labScripts: LabScript[];
}

export const TreatmentStatusContent = ({ labScripts }: TreatmentStatusProps) => {
  return (
    <Card className="p-6">
      <div className="text-gray-600">Treatment status will go here</div>
    </Card>
  );
};