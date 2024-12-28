import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface CompleteButtonProps {
  onClick: () => void;
}

export const CompleteButton = ({ onClick }: CompleteButtonProps) => {
  return (
    <Button 
      variant="outline"
      className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transform hover:scale-105 transition-all duration-300 group"
      onClick={onClick}
    >
      <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
      Complete Manufacturing
    </Button>
  );
};