import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { QueueItem } from "./QueueItem";
import { useQueueHandlers } from "./useQueueHandlers";

interface ManufacturingQueueProps {
  scripts: LabScript[];
  manufacturingStatus: Record<string, string>;
  sinteringStatus: Record<string, string>;
  miyoStatus: Record<string, string>;
  inspectionStatus: Record<string, string>;
}

export const ManufacturingQueue = ({
  scripts,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus
}: ManufacturingQueueProps) => {
  const {
    handleStartManufacturing,
    handleCompleteManufacturing,
    handleHoldManufacturing,
    handleResumeManufacturing,
    handleStartSintering,
    handleCompleteSintering,
    handleStartMiyo,
    handleCompleteMiyo,
    handleStartInspection,
    handleCompleteInspection,
  } = useQueueHandlers();

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Manufacturing Queue</h2>
      <div className="space-y-4">
        {scripts.map((script) => (
          <QueueItem
            key={script.id}
            script={script}
            manufacturingStatus={manufacturingStatus[script.id] || 'pending'}
            sinteringStatus={sinteringStatus[script.id] || 'pending'}
            miyoStatus={miyoStatus[script.id] || 'pending'}
            inspectionStatus={inspectionStatus[script.id] || 'pending'}
            onStartManufacturing={handleStartManufacturing}
            onCompleteManufacturing={handleCompleteManufacturing}
            onHoldManufacturing={handleHoldManufacturing}
            onResumeManufacturing={handleResumeManufacturing}
            onStartSintering={handleStartSintering}
            onCompleteSintering={handleCompleteSintering}
            onStartMiyo={handleStartMiyo}
            onCompleteMiyo={handleCompleteMiyo}
            onStartInspection={handleStartInspection}
            onCompleteInspection={handleCompleteInspection}
          />
        ))}
      </div>
    </Card>
  );
};