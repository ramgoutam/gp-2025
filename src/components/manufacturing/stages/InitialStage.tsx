import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface InitialStageProps {
  manufacturingType: string;
  onStart: () => void;
}

export const InitialStage = ({ manufacturingType, onStart }: InitialStageProps) => {
  return (
    <Button
      onClick={onStart}
      className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 transform hover:scale-105 animate-fade-in"
    >
      <Play className="w-4 h-4 mr-2 animate-pulse" />
      Start {manufacturingType}
    </Button>
  );
};