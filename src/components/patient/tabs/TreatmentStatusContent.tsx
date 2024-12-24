import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { TreatmentSection } from "@/components/lab-script/TreatmentSection";
import { Label } from "@/components/ui/label";

interface TreatmentStatusProps {
  labScripts: LabScript[];
}

export const TreatmentStatusContent = ({ labScripts }: TreatmentStatusProps) => {
  const [upperTreatment, setUpperTreatment] = useState("None");
  const [lowerTreatment, setLowerTreatment] = useState("None");

  // Get the latest lab script with report card data
  const latestScript = labScripts
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
    .find(script => script.clinicalInfo || script.designInfo);

  console.log("Latest script with report card:", latestScript);

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {/* Treatment Selection Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Treatment Selection</h3>
          <div className="grid grid-cols-2 gap-8">
            <TreatmentSection
              title="Upper"
              treatment={upperTreatment}
              onTreatmentChange={setUpperTreatment}
            />
            <TreatmentSection
              title="Lower"
              treatment={lowerTreatment}
              onTreatmentChange={setLowerTreatment}
            />
          </div>
        </div>

        {/* Report Card Data Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Latest Report Card Data</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-500">Latest Design Name</Label>
                <p className="mt-1 font-medium">
                  {latestScript?.upperDesignName || latestScript?.lowerDesignName || 'Not available'}
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Screw Type</Label>
                <p className="mt-1 font-medium">
                  {latestScript?.screwType || 'Not available'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-500">Material</Label>
                <p className="mt-1 font-medium">
                  {latestScript?.clinicalInfo?.material || 'Not available'}
                </p>
              </div>
              <div>
                <Label className="text-gray-500">Shade</Label>
                <p className="mt-1 font-medium">
                  {latestScript?.clinicalInfo?.shade || 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};