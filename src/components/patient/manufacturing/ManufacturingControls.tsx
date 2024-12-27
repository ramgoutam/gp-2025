import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { InitialStage } from "./stages/InitialStage";

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
}: ManufacturingControlsProps) => {
  console.log("Manufacturing Controls State:", { 
    isActive, 
    isPaused, 
    isCompleted, 
    isSintering,
    isMiyo 
  });

  // Only show the initial start button
  if (!isActive && !isPaused && !isCompleted && !isSintering && !isMiyo) {
    return <InitialStage manufacturingType={manufacturingType} onStart={onStart} />;
  }

  return null;
};