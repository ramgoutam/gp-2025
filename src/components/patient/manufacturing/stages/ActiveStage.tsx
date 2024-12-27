import { Button } from "@/components/ui/button";
import { Pause, StopCircle, Flame } from "lucide-react";

interface ActiveStageProps {
  manufacturingType: string;
  onPause: () => void;
  onHold: () => void;
  onComplete: () => void;
}

export const ActiveStage = ({ manufacturingType, onPause, onHold, onComplete }: ActiveStageProps) => (
  <div className="flex gap-2">
    <Button 
      variant="outline"
      className="hover:bg-yellow-50 text-yellow-600 border-yellow-200 group"
      onClick={onPause}
    >
      <Pause className="w-4 h-4 mr-2" />
      Pause
    </Button>
    <Button 
      variant="outline"
      className="hover:bg-red-50 text-red-600 border-red-200 group"
      onClick={onHold}
    >
      <StopCircle className="w-4 h-4 mr-2" />
      Hold
    </Button>
    <Button 
      variant="outline"
      className="hover:bg-orange-50 text-orange-600 border-orange-200"
      onClick={onComplete}
    >
      <Flame className="w-4 h-4 mr-2" />
      Complete {manufacturingType}
    </Button>
  </div>
);