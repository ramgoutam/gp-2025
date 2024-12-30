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
  onCompleteInspection?: (scriptId: string) => void;
  onHoldInspection?: (scriptId: string) => void;
  onResumeInspection?: (scriptId: string) => void;
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
  onCompleteInspection,
  onHoldInspection,
  onResumeInspection,
  manufacturingType = 'Milling'
}: ManufacturingStepsProps) => {
  const isPrinting = manufacturingType === 'Printing';
  console.log("Current manufacturing type:", manufacturingType);
  console.log("Manufacturing status:", manufacturingStatus);
  console.log("Miyo status:", miyoStatus);

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

  // For Printing, go directly to Miyo after manufacturing
  if (isPrinting) {
    if (miyoStatus !== 'completed') {
      console.log("Showing Miyo stage for printing workflow");
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

    // After Miyo is completed, show inspection
    if (inspectionStatus !== 'completed') {
      return (
        <InspectionStage
          scriptId={scriptId}
          status={inspectionStatus}
          onStart={() => onStartInspection?.(scriptId)}
          onComplete={() => onCompleteInspection?.(scriptId)}
          onHold={() => onHoldInspection?.(scriptId)}
          onResume={() => onResumeInspection?.(scriptId)}
        />
      );
    }
  } else {
    // For Milling, show sintering stage if manufacturing is completed
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

    // Show Inspection stage if Miyo is completed
    if (inspectionStatus !== 'completed') {
      return (
        <InspectionStage
          scriptId={scriptId}
          status={inspectionStatus}
          onStart={() => onStartInspection?.(scriptId)}
          onComplete={() => onCompleteInspection?.(scriptId)}
          onHold={() => onHoldInspection?.(scriptId)}
          onResume={() => onResumeInspection?.(scriptId)}
        />
      );
    }
  }

  // Show final status
  return (
    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
      Manufacturing Complete
    </div>
  );
};