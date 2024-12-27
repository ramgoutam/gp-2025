import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface InitialStageProps {
  manufacturingType: string;
  onStart: () => void;
}

export const InitialStage = ({ manufacturingType, onStart }: InitialStageProps) => (
  <button
    onClick={onStart}
    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200"
  >
    <Play className="w-4 h-4" />
    <span>Start {manufacturingType}</span>
  </button>
);