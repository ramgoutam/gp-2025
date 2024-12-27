import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface InitialStageProps {
  manufacturingType: string;
  onStart: () => void;
}

export const InitialStage = ({ manufacturingType, onStart }: InitialStageProps) => (
  <Button 
    className="bg-primary hover:bg-primary/90"
    onClick={onStart}
  >
    <Play className="w-4 h-4 mr-2" />
    {manufacturingType === 'Milling' ? 'Start Milling' : 'Start Printing'}
  </Button>
);