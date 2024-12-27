import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { InitialStage } from "./stages/InitialStage";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  onStart,
}: ManufacturingControlsProps) => {
  console.log("Manufacturing Controls State:", { isActive });

  if (!isActive) {
    return <InitialStage manufacturingType={manufacturingType} onStart={onStart} />;
  }

  return (
    <div className="space-y-4">
      <ToggleGroup type="single" className="flex gap-2">
        <ToggleGroupItem value="milling" className="flex items-center gap-2 data-[state=on]:bg-primary data-[state=on]:text-white">
          {manufacturingType === 'Milling' ? 'Milling' : 'Printing'}
        </ToggleGroupItem>
        <ToggleGroupItem value="sintering" className="flex items-center gap-2 data-[state=on]:bg-primary data-[state=on]:text-white">
          Sintering
        </ToggleGroupItem>
        <ToggleGroupItem value="miyo" className="flex items-center gap-2 data-[state=on]:bg-primary data-[state=on]:text-white">
          MIYO
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};