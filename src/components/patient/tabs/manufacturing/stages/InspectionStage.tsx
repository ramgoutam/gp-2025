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

  const handleApproveInspection = async () => {
    try {
      console.log("Approving inspection for script:", scriptId);
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          inspection_status: 'approved',
          inspection_completed_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      onApprove();
      toast({
        title: "Inspection Approved",
        description: "The appliance has passed inspection.",
      });
    } catch (error) {
      console.error("Error approving inspection:", error);
      toast({
        title: "Error",
        description: "Failed to approve inspection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRejectInspection = async () => {
    try {
      console.log("Rejecting inspection for script:", scriptId);
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          inspection_status: 'rejected',
          inspection_completed_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      onReject();
      toast({
        title: "Inspection Rejected",
        description: "The appliance has failed inspection.",
      });
    } catch (error) {
      console.error("Error rejecting inspection:", error);
      toast({
        title: "Error",
        description: "Failed to reject inspection. Please try again.",
        variant: "destructive"
      });
    }
  };

  console.log("Current inspection status:", status); // Debug log

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
    console.log("Rendering approve/reject buttons"); // Debug log
    return (
      <div className="flex gap-2 animate-fade-in">
        <Button
          variant="outline"
          size="sm"
          onClick={handleApproveInspection}
          className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
        >
          <ThumbsUp className="h-4 w-4 mr-2 transition-all duration-300 group-hover:scale-110" />
          Pass Inspection
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRejectInspection}
          className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
        >
          <ThumbsDown className="h-4 w-4 mr-2 transition-all duration-300 group-hover:scale-110" />
          Fail Inspection
        </Button>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
        Ready to Insert
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md border border-red-200 animate-fade-in">
        Appliance Failed Inspection
      </div>
    );
  }

  return null;
};