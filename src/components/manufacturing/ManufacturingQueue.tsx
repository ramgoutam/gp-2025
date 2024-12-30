import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { StatusMap } from "@/types/manufacturing";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";

interface ManufacturingQueueProps {
  scripts: LabScript[];
  manufacturingStatus: StatusMap;
  sinteringStatus: StatusMap;
  miyoStatus: StatusMap;
  inspectionStatus: StatusMap;
}

export const ManufacturingQueue = ({ 
  scripts,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus 
}: ManufacturingQueueProps) => {
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

  if (scripts.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          No manufacturing items available
        </div>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 pr-4">
        {scripts.map((script) => (
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
                  patientFirstName={script.patientFirstName}
                  patientLastName={script.patientLastName}
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
    </ScrollArea>
  );
};