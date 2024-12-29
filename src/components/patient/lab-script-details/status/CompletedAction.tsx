import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface CompletedActionProps {
  onStatusChange: (newStatus: string) => void;
}

export const CompletedAction = ({ onStatusChange }: CompletedActionProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onStatusChange('in_progress')}
      className="hover:bg-blue-50 text-blue-600 border-blue-200 group animate-fade-in"
    >
      <AlertCircle className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
      Edit Status
    </Button>
  );
};