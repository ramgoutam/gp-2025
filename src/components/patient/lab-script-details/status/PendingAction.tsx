import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface PendingActionProps {
  onStatusChange: (newStatus: string) => void;
}

export const PendingAction = ({ onStatusChange }: PendingActionProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onStatusChange('in_progress')}
      className="hover:bg-primary/5 group animate-fade-in"
    >
      <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
      Start Design
    </Button>
  );
};