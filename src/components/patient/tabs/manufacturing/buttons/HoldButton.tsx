import { PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HoldButtonProps {
  onHold: () => void;
}

export const HoldButton = ({ onHold }: HoldButtonProps) => {
  return (
    <Button 
      variant="outline"
      className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 transform hover:scale-105 transition-all duration-300 group"
      onClick={onHold}
    >
      <PauseCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
      Hold
    </Button>
  );
};