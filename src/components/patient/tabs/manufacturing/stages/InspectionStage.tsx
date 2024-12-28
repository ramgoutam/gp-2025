import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, CheckCircle } from "lucide-react";
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

  const handleCompleteInspection = async () => {
    try {
      console.log("Completing inspection for script:", scriptId);
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          inspection_status: 'completed',
          inspection_completed_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      onApprove();
      toast({
        title: "Inspection Completed",
        description: "The inspection has been completed successfully.",
      });
    } catch (error) {
      console.error("Error completing inspection:", error);
      toast({
        title: "Error",
        description: "Failed to complete inspection. Please try again.",
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
        className={`${buttonClass} hover:bg-primary/5 group`}
      >
        <Search className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110 mr-2" />
        Start Inspection
      </Button>
    );
  }

  if (status === 'in_progress') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleCompleteInspection}
        className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
      >
        <CheckCircle className="h-4 w-4 mr-2 transition-all duration-300 group-hover:scale-110" />
        Complete Inspection
      </Button>
    );
  }

  if (status === 'completed') {
    return (
      <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
        Inspection Completed
      </div>
    );
  }

  return null;
};