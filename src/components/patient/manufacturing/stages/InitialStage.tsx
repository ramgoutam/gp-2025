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
      className="relative overflow-hidden group bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-10 py-7 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-center gap-3">
        <Play className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        <span className="text-xl font-semibold tracking-wide">
          Start {manufacturingType}
        </span>
      </div>
    </Button>
  );
};