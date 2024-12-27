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
      className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-6 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl animate-fade-in group"
    >
      <Play className="w-5 h-5 mr-3 animate-pulse group-hover:scale-110 transition-transform" />
      <span className="text-lg font-medium">Start {manufacturingType}</span>
    </Button>
  );
};