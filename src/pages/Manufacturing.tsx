import { Card } from "@/components/ui/card";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";
import { useManufacturingLogs } from "@/hooks/useManufacturingLogs";

const Manufacturing = () => {
  const { data: manufacturingData = {
    counts: {
      inhousePrinting: 0,
      inhouseMilling: 0,
      outsourcePrinting: 0,
      outsourceMilling: 0,
      total: 0
    },
    scripts: []
  }} = useManufacturingData();

  const {
    manufacturingStatus,
    sinteringStatus,
    miyoStatus,
    inspectionStatus,
  } = useManufacturingLogs(manufacturingData.scripts);

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

  return (
    <div className="container mx-auto p-8 space-y-6">
      <ManufacturingHeader />
      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Manufacturing Queue</h2>
          <div className="space-y-4">
            {manufacturingData.scripts.map((script) => (
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
        </Card>
      </div>
    </div>
  );
};

export default Manufacturing;