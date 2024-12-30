import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { QueueItem } from "./QueueItem";

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
          />
        ))}
      </div>
    </Card>
  );
};