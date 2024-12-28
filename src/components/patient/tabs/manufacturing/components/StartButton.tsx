import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useDesignInfoStatus } from "../hooks/useDesignInfoStatus";

interface StartButtonProps {
  scriptId: string;
  onStart: () => void;
  className?: string;
}

export const StartButton = ({ scriptId, onStart, className = "" }: StartButtonProps) => {
  const { validateDesignInfoStatus, isLoading } = useDesignInfoStatus(scriptId);

  const handleClick = () => {
    if (validateDesignInfoStatus()) {
      onStart();
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} hover:bg-primary/5 group animate-fade-in`}
    >
      <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
      Start
    </Button>
  );
};