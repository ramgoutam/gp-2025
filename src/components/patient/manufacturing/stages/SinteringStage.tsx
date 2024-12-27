import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SinteringStageProps {
  onCompleteSintering: () => void;
}

export const SinteringStage = ({ onCompleteSintering }: SinteringStageProps) => (
  <Button 
    variant="outline"
    className="hover:bg-green-50 text-green-600 border-green-200"
    onClick={onCompleteSintering}
  >
    <Check className="w-4 h-4 mr-2" />
    Complete Sintering
  </Button>
);