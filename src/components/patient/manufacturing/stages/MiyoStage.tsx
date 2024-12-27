import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";

interface MiyoStageProps {
  onStartMiyo: () => void;
  onCompleteMiyo: () => void;
  isMiyoStarted: boolean;
}

export const MiyoStage = ({ onStartMiyo, onCompleteMiyo, isMiyoStarted }: MiyoStageProps) => (
  <div className="flex gap-2">
    {!isMiyoStarted ? (
      <Button 
        variant="outline"
        className="hover:bg-orange-50 text-orange-600 border-orange-200"
        onClick={onStartMiyo}
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Start Miyo
      </Button>
    ) : (
      <Button 
        variant="outline"
        className="hover:bg-green-50 text-green-600 border-green-200"
        onClick={onCompleteMiyo}
      >
        <Check className="w-4 h-4 mr-2" />
        Complete Miyo
      </Button>
    )}
  </div>
);