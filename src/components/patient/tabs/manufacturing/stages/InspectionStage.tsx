import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, ThumbsDown, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InspectionStageProps {
  scriptId: string;
  status: string;
  onStart: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const InspectionStage = ({
  scriptId,
  status,
  onStart,
  onApprove,
  onReject
}: InspectionStageProps) => {
  const { toast } = useToast();
  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const handleStartInspection = async () => {
    try {
      console.log("Starting inspection for script:", scriptId);
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          inspection_status: 'in_progress',
          inspection_started_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      onStart();
      toast({
        title: "Inspection Started",
        description: "The inspection process has been initiated.",
      });
    } catch (error) {
      console.error("Error starting inspection:", error);
      toast({
        title: "Error",
        description: "Failed to start inspection. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (status === 'pending') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleStartInspection}
        className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
      >
        <Search className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
        Start Inspection
      </Button>
    );
  }

  if (status === 'in_progress') {
    return (
      <div className="flex gap-2 animate-fade-in">
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
        >
          <ThumbsUp className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Pass Inspection
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
        >
          <ThumbsDown className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Fail Inspection
        </Button>
      </div>
    );
  }

  return null;
};