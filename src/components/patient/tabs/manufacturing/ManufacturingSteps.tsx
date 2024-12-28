import React from "react";
import { ManufacturingStage } from "./stages/ManufacturingStage";
import { SinteringStage } from "./stages/SinteringStage";
import { MiyoStage } from "./stages/MiyoStage";
import { InspectionStage } from "./stages/InspectionStage";

interface ManufacturingStepsProps {
  scriptId: string;
  manufacturingStatus: { [key: string]: string };
  sinteringStatus: { [key: string]: string };
  miyoStatus: { [key: string]: string };
  inspectionStatus: { [key: string]: string };
  onStartManufacturing: (scriptId: string) => void;
  onCompleteManufacturing: (scriptId: string) => void;
  onHoldManufacturing: (scriptId: string) => void;
  onResumeManufacturing: (scriptId: string) => void;
  onStartSintering: (scriptId: string) => void;
  onCompleteSintering: (scriptId: string) => void;
  onHoldSintering: (scriptId: string) => void;
  onResumeSintering: (scriptId: string) => void;
  onStartMiyo: (scriptId: string) => void;
  onCompleteMiyo: (scriptId: string) => void;
  onStartInspection: (scriptId: string) => void;
  onApproveInspection: (scriptId: string) => void;
  onRejectInspection: (scriptId: string) => void;
  manufacturingType?: string;
}

export const ManufacturingSteps = ({
  scriptId,
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
  onHoldSintering,
  onResumeSintering,
  onStartMiyo,
  onCompleteMiyo,
  onStartInspection,
  onApproveInspection,
  onRejectInspection,
  manufacturingType = 'Milling'
}: ManufacturingStepsProps) => {
  const currentStatus = manufacturingStatus[scriptId];
  
  // Show manufacturing stage if not completed
  if (!currentStatus || currentStatus !== 'completed') {
    return (
      <ManufacturingStage
        scriptId={scriptId}
        status={currentStatus || 'pending'}
        manufacturingType={manufacturingType}
        onStart={() => onStartManufacturing(scriptId)}
        onComplete={() => onCompleteManufacturing(scriptId)}
        onHold={() => onHoldManufacturing(scriptId)}
        onResume={() => onResumeManufacturing(scriptId)}
      />
    );
  }

  // Show sintering stage if manufacturing is completed
  const sinteringCurrentStatus = sinteringStatus[scriptId];
  if (!sinteringCurrentStatus || sinteringCurrentStatus !== 'completed') {
    return (
      <SinteringStage
        scriptId={scriptId}
        status={sinteringCurrentStatus || 'pending'}
        onStart={() => onStartSintering(scriptId)}
        onComplete={() => onCompleteSintering(scriptId)}
        onHold={() => onHoldSintering(scriptId)}
        onResume={() => onResumeSintering(scriptId)}
      />
    );
  }

  // Show Miyo stage if sintering is completed
  const miyoCurrentStatus = miyoStatus[scriptId];
  if (!miyoCurrentStatus || miyoCurrentStatus !== 'completed') {
    return (
      <MiyoStage
        scriptId={scriptId}
        status={miyoCurrentStatus || 'pending'}
        onStart={() => onStartMiyo(scriptId)}
        onComplete={() => onCompleteMiyo(scriptId)}
      />
    );
  }

  // Show inspection stage if Miyo is completed
  const inspectionCurrentStatus = inspectionStatus[scriptId];
  if (inspectionCurrentStatus !== 'approved' && inspectionCurrentStatus !== 'rejected') {
    return (
      <InspectionStage
        scriptId={scriptId}
        status={inspectionCurrentStatus || 'pending'}
        onStart={() => onStartInspection(scriptId)}
        onApprove={() => onApproveInspection(scriptId)}
        onReject={() => onRejectInspection(scriptId)}
      />
    );
  }

  // Show final status
  if (inspectionCurrentStatus === 'approved') {
    return (
      <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
        Ready to Insert
      </div>
    );
  }

  if (inspectionCurrentStatus === 'rejected') {
    return (
      <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md border border-red-200 animate-fade-in">
        Appliance Failed Inspection
      </div>
    );
  }

  return null;
};