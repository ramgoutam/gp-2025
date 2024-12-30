import { Card } from "@/components/ui/card";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";
import { LabScript } from "@/types/labScript";

interface QueueItemProps {
  script: LabScript;
  manufacturingStatus: string;
  sinteringStatus: string;
  miyoStatus: string;
  inspectionStatus: string;
  onStartManufacturing: (scriptId: string) => void;
  onCompleteManufacturing: (scriptId: string) => void;
  onHoldManufacturing: (scriptId: string, reason?: string) => void;
  onResumeManufacturing: (scriptId: string) => void;
  onStartSintering: (scriptId: string) => void;
  onCompleteSintering: (scriptId: string) => void;
  onStartMiyo: (scriptId: string) => void;
  onCompleteMiyo: (scriptId: string) => void;
  onStartInspection: (scriptId: string) => void;
  onCompleteInspection: (scriptId: string) => void;
}

export const QueueItem = ({
  script,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus,
  onStartManufacturing,
  onCompleteManufacturing,
  onHoldManufacturing,
  onResumeManufacturing,
  onStartSintering,
  onCompleteSintering,
  onStartMiyo,
  onCompleteMiyo,
  onStartInspection,
  onCompleteInspection,
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
          {script.manufacturingSource === 'Inhouse' && (
            <ManufacturingSteps
              scriptId={script.id}
              manufacturingStatus={manufacturingStatus}
              sinteringStatus={sinteringStatus}
              miyoStatus={miyoStatus}
              inspectionStatus={inspectionStatus}
              onStartManufacturing={onStartManufacturing}
              onCompleteManufacturing={onCompleteManufacturing}
              onHoldManufacturing={onHoldManufacturing}
              onResumeManufacturing={onResumeManufacturing}
              onStartSintering={onStartSintering}
              onCompleteSintering={onCompleteSintering}
              onStartMiyo={onStartMiyo}
              onCompleteMiyo={onCompleteMiyo}
              onStartInspection={onStartInspection}
              onCompleteInspection={onCompleteInspection}
              manufacturingType={script.manufacturingType}
            />
          )}
        </div>
      </div>
    </Card>
  );
};