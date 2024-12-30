import { Card } from "@/components/ui/card";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";
import { LabScript } from "@/types/labScript";

interface QueueItemProps {
  script: LabScript;
  manufacturingStatus: string;
  sinteringStatus: string;
  miyoStatus: string;
  inspectionStatus: string;
}

export const QueueItem = ({
  script,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus,
}: QueueItemProps) => {
  return (
    <Card key={script.id} className="p-4 transition-all duration-300 hover:shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <ScriptInfo
            applianceType={script.applianceType || ''}
            upperDesignName={script.upperDesignName || ''}
            lowerDesignName={script.lowerDesignName || ''}
            manufacturingSource={script.manufacturingSource || ''}
            manufacturingType={script.manufacturingType || ''}
            material={script.material || ''}
            shade={script.shade || ''}
            designInfo={script.designInfo}
            patientFirstName={script.patientFirstName}
            patientLastName={script.patientLastName}
          />
        </div>
      </div>
    </Card>
  );
};