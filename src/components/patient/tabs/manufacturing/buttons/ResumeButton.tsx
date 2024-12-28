import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

interface ResumeButtonProps {
  onClick: () => void;
}

export const ResumeButton = ({ onClick }: ResumeButtonProps) => {
  return (
    <Button 
      variant="outline"
      className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 group"
      onClick={onClick}
    >
      <PlayCircle className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
      Resume Manufacturing
    </Button>
  );
};