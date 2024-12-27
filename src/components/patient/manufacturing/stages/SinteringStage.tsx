import { Button } from "@/components/ui/button";
import { Pause, StopCircle, Check } from "lucide-react";

interface SinteringStageProps {
  onPauseSintering: () => void;
  onHoldSintering: () => void;
  onCompleteSintering: () => void;
}

export const SinteringStage = ({ onPauseSintering, onHoldSintering, onCompleteSintering }: SinteringStageProps) => (
  <div className="flex gap-2">
    <Button 
      variant="outline"
      className="hover:bg-yellow-50 text-yellow-600 border-yellow-200 group"
      onClick={onPauseSintering}
    >
      <Pause className="w-4 h-4 mr-2" />
      Pause Sintering
    </Button>
    <Button 
      variant="outline"
      className="hover:bg-red-50 text-red-600 border-red-200 group"
      onClick={onHoldSintering}
    >
      <StopCircle className="w-4 h-4 mr-2" />
      Hold Sintering
    </Button>
    <Button 
      variant="outline"
      className="hover:bg-green-50 text-green-600 border-green-200"
      onClick={onCompleteSintering}
    >
      <Check className="w-4 h-4 mr-2" />
      Complete Sintering
    </Button>
  </div>
);