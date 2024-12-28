import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useDesignInfoStatus } from '@/hooks/useDesignInfoStatus';
import { useToast } from '@/hooks/use-toast';

interface StartButtonProps {
  scriptId: string;
  onStart: () => void;
  manufacturingType: string;
}

export const StartButton = ({ scriptId, onStart, manufacturingType }: StartButtonProps) => {
  const { isDesignInfoCompleted, isLoading } = useDesignInfoStatus(scriptId);
  const { toast } = useToast();
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const handleClick = () => {
    if (!isDesignInfoCompleted) {
      toast({
        title: "Cannot Start Manufacturing",
        description: "Please complete the design information before starting manufacturing.",
        variant: "destructive"
      });
      return;
    }
    onStart();
  };

  if (isLoading) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={buttonClass}
      >
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
    >
      <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
      Start {manufacturingType}
    </Button>
  );
};