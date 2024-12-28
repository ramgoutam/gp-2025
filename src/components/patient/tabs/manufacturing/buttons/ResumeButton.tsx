import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResumeButtonProps {
  onResume: () => void;
  holdReason?: string;
}

export const ResumeButton = ({ onResume, holdReason }: ResumeButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={onResume}
          >
            <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
            Resume
          </Button>
        </TooltipTrigger>
        {holdReason && (
          <TooltipContent>
            <p>Hold reason: {holdReason}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};