import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";
import { useState } from "react";
import { HoldReasonDialog } from "./HoldReasonDialog";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");

  const { data: currentScript } = useQuery({
    queryKey: ['scriptStatus', script.id],
    queryFn: async () => {
      console.log("Fetching status for script:", script.id);
      try {
        const { data, error } = await supabase
          .from('lab_scripts')
          .select('*')
          .eq('id', script.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching script status:", error);
          throw error;
        }

        if (!data) {
          console.log("No data found for script status:", script.id);
          return script;
        }

        const validStatus = data.status as LabScriptStatus;
        return mapDatabaseLabScript({ ...data, status: validStatus });
      } catch (error) {
        console.error("Unexpected error fetching script status:", error);
        return script;
      }
    },
    refetchInterval: 1000,
    initialData: script,
  });

  const status = currentScript?.status || script.status;

  const handleStatusChange = async (newStatus: LabScript['status'], holdReason?: string, additionalInfo?: string) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);
      console.log("Hold reason:", holdReason);
      console.log("Additional info:", additionalInfo);

      const updates: any = { 
        status: newStatus,
        hold_reason: holdReason,
        specific_instructions: additionalInfo
      };

      // If it's a hold for approval, store the link in design_link instead
      if (holdReason === "Hold for Approval") {
        updates.design_link = additionalInfo;
        updates.specific_instructions = null;
      }

      const { error } = await supabase
        .from('lab_scripts')
        .update(updates)
        .eq('id', script.id);

      if (error) {
        console.error("Error updating status:", error);
        throw error;
      }

      onStatusChange(newStatus);
      
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleHoldConfirm = (reason: string, additionalInfo?: string) => {
    if (reason) {
      handleStatusChange('hold', reason, additionalInfo);
      setShowHoldDialog(false);
      setSelectedReason("");
    }
  };

  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  switch (status) {
    case 'pending':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
          Start Design
        </Button>
      );
    
    case 'in_progress':
      return (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('paused')}
              className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
            >
              <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHoldDialog(true)}
              className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
            >
              <StopCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Hold
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('completed')}
              className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
            >
              <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Complete
            </Button>

            <HoldReasonDialog
              open={showHoldDialog}
              onOpenChange={setShowHoldDialog}
              onConfirm={handleHoldConfirm}
              selectedReason={selectedReason}
              onReasonChange={setSelectedReason}
            />
          </div>
        </div>
      );
    
    case 'paused':
    case 'hold':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <PlayCircle className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
          Resume
        </Button>
      );
    
    case 'completed':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 border-blue-200 group animate-fade-in`}
        >
          <AlertCircle className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
          Edit Status
        </Button>
      );
    
    default:
      return null;
  }
};