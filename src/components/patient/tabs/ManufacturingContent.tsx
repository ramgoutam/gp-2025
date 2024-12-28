import React from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EmptyManufacturingState } from "./manufacturing/ManufacturingCard";
import { ManufacturingSteps } from "./manufacturing/ManufacturingSteps";
import { ScriptInfo } from "./manufacturing/ScriptInfo";
import { useManufacturingLogs } from "@/hooks/useManufacturingLogs";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts, patientData }: ManufacturingContentProps) => {
  const { toast } = useToast();
  
  const manufacturingScripts = labScripts.filter(script => 
    script.manufacturingSource && script.manufacturingType
  );

  const {
    manufacturingStatus,
    sinteringStatus,
    miyoStatus,
    inspectionStatus,
  } = useManufacturingLogs(manufacturingScripts);

  const handleStartManufacturing = async (scriptId: string) => {
    console.log('Starting manufacturing process for script:', scriptId);
  };

  const handleCompleteManufacturing = async (scriptId: string) => {
    console.log('Completing manufacturing process for script:', scriptId);
  };

  const handleHoldManufacturing = async (scriptId: string) => {
    console.log('Holding manufacturing process for script:', scriptId);
  };

  const handleResumeManufacturing = async (scriptId: string) => {
    console.log('Resuming manufacturing process for script:', scriptId);
  };

  const handleStartInspection = async (scriptId: string) => {
    console.log('Starting inspection process for script:', scriptId);
  };

  const handleCompleteInspection = async (scriptId: string) => {
    console.log('Completing inspection process for script:', scriptId);
  };

  const handleHoldInspection = async (scriptId: string) => {
    console.log('Holding inspection process for script:', scriptId);
  };

  const handleResumeInspection = async (scriptId: string) => {
    console.log('Resuming inspection process for script:', scriptId);
  };

  if (manufacturingScripts.length === 0) {
    return <EmptyManufacturingState firstName={patientData.firstName} lastName={patientData.lastName} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {manufacturingScripts.map((script) => (
          <Card key={script.id} className="p-4 transition-all duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ScriptInfo
                  applianceType={script.applianceType}
                  upperDesignName={script.upperDesignName}
                  lowerDesignName={script.lowerDesignName}
                  manufacturingSource={script.manufacturingSource}
                  manufacturingType={script.manufacturingType}
                  material={script.material}
                  shade={script.shade}
                />
                {script.manufacturingSource === 'Inhouse' && (
                  <ManufacturingSteps
                    scriptId={script.id}
                    manufacturingStatus={manufacturingStatus[script.id] || 'pending'}
                    sinteringStatus={sinteringStatus[script.id] || 'pending'}
                    miyoStatus={miyoStatus[script.id] || 'pending'}
                    inspectionStatus={inspectionStatus[script.id] || 'pending'}
                    onStartManufacturing={handleStartManufacturing}
                    onCompleteManufacturing={handleCompleteManufacturing}
                    onHoldManufacturing={handleHoldManufacturing}
                    onResumeManufacturing={handleResumeManufacturing}
                    onStartInspection={handleStartInspection}
                    onCompleteInspection={handleCompleteInspection}
                    onHoldInspection={handleHoldInspection}
                    onResumeInspection={handleResumeInspection}
                    manufacturingType={script.manufacturingType}
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};