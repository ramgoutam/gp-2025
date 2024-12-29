import React from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

interface PausedActionProps {
  onStatusChange: (newStatus: string) => void;
}

export const PausedAction = ({ onStatusChange }: PausedActionProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onStatusChange('in_progress')}
      className="hover:bg-primary/5 group animate-fade-in"
    >
      <PlayCircle className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
      Resume
    </Button>
  );
};