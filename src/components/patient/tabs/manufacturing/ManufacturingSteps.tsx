import React from "react";
import { ManufacturingStage } from "./stages/ManufacturingStage";
import { SinteringStage } from "./stages/SinteringStage";
import { MiyoStage } from "./stages/MiyoStage";
import { InspectionStage } from "./stages/InspectionStage";

interface ManufacturingStepsProps {
  scriptId: string;
  manufacturingStatus: string;
  sinteringStatus: string;
  miyoStatus: string;
  inspectionStatus: string;
  onStartManufacturing: (scriptId: string) => void;
  onCompleteManufacturing: (scriptId: string) => void;
  onHoldManufacturing: (scriptId: string) => void;
  onResumeManufacturing: (scriptId: string) => void;
  onStartSintering?: (scriptId: string) => void;
  onCompleteSintering?: (scriptId: string) => void;
  onHoldSintering?: (scriptId: string) => void;
  onResumeSintering?: (scriptId: string) => void;
  onStartMiyo?: (scriptId: string) => void;
  onCompleteMiyo?: (scriptId: string) => void;
  onHoldMiyo?: (scriptId: string) => void;
  onResumeMiyo?: (scriptId: string) => void;
  onStartInspection?: (scriptId: string) => void;
  onApproveInspection?: (scriptId: string) => void;
  onRejectInspection?: (scriptId: string) => void;
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
  onHoldMiyo,
  onResumeMiyo,
  onStartInspection,
  onApproveInspection,
  onRejectInspection,
  manufacturingType = 'Milling'
}: ManufacturingStepsProps) => {
  // Show manufacturing stage if not completed
  if (manufacturingStatus !== 'completed') {
    return (
      <ManufacturingStage
        scriptId={scriptId}
        status={manufacturingStatus}
        manufacturingType={manufacturingType}
        onStart={() => onStartManufacturing(scriptId)}
        onComplete={() => onCompleteManufacturing(scriptId)}
        onHold={() => onHoldManufacturing(scriptId)}
        onResume={() => onResumeManufacturing(scriptId)}
      />
    );
  }

  // Show sintering stage if manufacturing is completed
  if (sinteringStatus !== 'completed') {
    return (
      <SinteringStage
        scriptId={scriptId}
        status={sinteringStatus}
        onStart={() => onStartSintering?.(scriptId)}
        onComplete={() => onCompleteSintering?.(scriptId)}
        onHold={() => onHoldSintering?.(scriptId)}
        onResume={() => onResumeSintering?.(scriptId)}
      />
    );
  }

  // Show Miyo stage if sintering is completed
  if (miyoStatus !== 'completed') {
    return (
      <MiyoStage
        scriptId={scriptId}
        status={miyoStatus}
        onStart={() => onStartMiyo?.(scriptId)}
        onComplete={() => onCompleteMiyo?.(scriptId)}
        onHold={() => onHoldMiyo?.(scriptId)}
        onResume={() => onResumeMiyo?.(scriptId)}
      />
    );
  }

  // Show inspection stage if Miyo is completed
  if (inspectionStatus !== 'approved' && inspectionStatus !== 'rejected') {
    return (
      <InspectionStage
        scriptId={scriptId}
        status={inspectionStatus}
        onStart={() => onStartInspection?.(scriptId)}
        onApprove={() => onApproveInspection?.(scriptId)}
        onReject={() => onRejectInspection?.(scriptId)}
      />
    );
  }

  // Show final status
  if (inspectionStatus === 'approved') {
    return (
      <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
        Ready to Insert
      </div>
    );
  }

  if (inspectionStatus === 'rejected') {
    return (
      <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md border border-red-200 animate-fade-in">
        Appliance Failed Inspection
      </div>
    );
  }

  return null;
};