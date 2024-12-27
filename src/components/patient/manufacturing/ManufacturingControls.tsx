import { Button } from "@/components/ui/button";
import { Play, AlertCircle, Check } from "lucide-react";
import { InitialStage } from "./stages/InitialStage";
import { ActiveStage } from "./stages/ActiveStage";
import { SinteringStage } from "./stages/SinteringStage";
import { MiyoStage } from "./stages/MiyoStage";

interface ManufacturingControlsProps {
  manufacturingType: string;
  isActive: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  isSintering: boolean;
  isMiyo: boolean;
  onStart: () => void;
  onPause: () => void;
  onHold: () => void;
  onResume: () => void;
  onComplete: () => void;
  onStartSintering: () => void;
  onPauseSintering: () => void;
  onHoldSintering: () => void;
  onResumeSintering: () => void;
  onCompleteSintering: () => void;
  onStartMiyo: () => void;
  onCompleteMiyo: () => void;
  onReadyToInsert: () => void;
}

export const ManufacturingControls = ({
  manufacturingType,
  isActive,
  isPaused,
  isCompleted,
  isSintering,
  isMiyo,
  onStart,
  onPause,
  onHold,
  onResume,
  onComplete,
  onStartSintering,
  onPauseSintering,
  onHoldSintering,
  onResumeSintering,
  onCompleteSintering,
  onStartMiyo,
  onCompleteMiyo,
  onReadyToInsert,
}: ManufacturingControlsProps) => {
  console.log("Manufacturing Controls State:", { 
    isActive, 
    isPaused, 
    isCompleted, 
    isSintering,
    isMiyo 
  });

  // Initial state - Start Printing/Milling
  if (!isActive && !isPaused && !isCompleted && !isSintering && !isMiyo) {
    return <InitialStage manufacturingType={manufacturingType} onStart={onStart} />;
  }

  // Paused state during Printing/Milling
  if (isPaused && !isSintering && !isMiyo) {
    return (
      <Button 
        variant="outline"
        className="hover:bg-primary/5 group animate-fade-in"
        onClick={onResume}
      >
        <Play className="w-4 h-4 mr-2 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
        {manufacturingType === 'Milling' ? 'Resume Milling' : 'Resume Printing'}
      </Button>
    );
  }

  // Active Printing/Milling state
  if (isActive && !isCompleted && !isSintering && !isMiyo) {
    return (
      <ActiveStage 
        manufacturingType={manufacturingType}
        onPause={onPause}
        onHold={onHold}
        onComplete={onComplete}
      />
    );
  }

  // After Printing/Milling completed, before Sintering
  if (isCompleted && !isSintering && !isMiyo) {
    return (
      <Button 
        variant="outline"
        className="hover:bg-orange-50 text-orange-600 border-orange-200"
        onClick={onStartSintering}
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Start Sintering
      </Button>
    );
  }

  // During Sintering
  if (isSintering) {
    if (isPaused) {
      return (
        <Button 
          variant="outline"
          className="hover:bg-primary/5 group animate-fade-in"
          onClick={onResumeSintering}
        >
          <Play className="w-4 h-4 mr-2 text-primary" />
          Resume Sintering
        </Button>
      );
    }
    return (
      <SinteringStage 
        onPauseSintering={onPauseSintering}
        onHoldSintering={onHoldSintering}
        onCompleteSintering={onCompleteSintering}
      />
    );
  }

  // After Sintering completed, before Miyo
  if (isCompleted && !isMiyo) {
    return (
      <MiyoStage 
        onStartMiyo={onStartMiyo}
        onCompleteMiyo={onCompleteMiyo}
        isMiyoStarted={false}
      />
    );
  }

  // During Miyo
  if (isMiyo) {
    return (
      <MiyoStage 
        onStartMiyo={onStartMiyo}
        onCompleteMiyo={onCompleteMiyo}
        isMiyoStarted={true}
      />
    );
  }

  // Ready to Insert (Final stage)
  if (isCompleted) {
    return (
      <Button 
        variant="outline"
        className="hover:bg-green-50 text-green-600 border-green-200"
        onClick={onReadyToInsert}
      >
        <Check className="w-4 h-4 mr-2" />
        Ready to Insert
      </Button>
    );
  }

  return null;
};