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
      className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group"
    >
      <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
      <span className="text-sm font-medium">Start {manufacturingType}</span>
    </Button>
  );
};