import { useState } from "react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PendingAction } from "./status/PendingAction";
import { InProgressActions } from "./status/InProgressActions";
import { PausedAction } from "./status/PausedAction";
import { CompletedAction } from "./status/CompletedAction";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
  onDesignInfo?: () => void;
}

export const StatusButton = ({ script, onStatusChange, onDesignInfo }: StatusButtonProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

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

        return data || script;
      } catch (error) {
        console.error("Unexpected error fetching script status:", error);
        return script;
      }
    },
    refetchInterval: 1000,
    initialData: script,
  });

  const handleStatusChange = async (newStatus: LabScript['status'], holdReason?: string, additionalInfo?: string) => {
    try {
      setIsUpdating(true);
      console.log("Updating status for script:", script.id, "to:", newStatus);
      console.log("Hold reason:", holdReason);
      console.log("Additional info:", additionalInfo);

      const updates: any = { 
        status: newStatus,
        hold_reason: holdReason,
        specific_instructions: additionalInfo
      };

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
      
      if (newStatus !== 'completed') {
        toast({
          title: "Status Updated",
          description: `Status changed to ${newStatus.replace('_', ' ')}`
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const status = currentScript?.status || script.status;

  switch (status) {
    case 'pending':
      return <PendingAction onStatusChange={handleStatusChange} isUpdating={isUpdating} />;
    
    case 'in_progress':
      return (
        <InProgressActions 
          onStatusChange={handleStatusChange}
          onDesignInfo={onDesignInfo}
          isUpdating={isUpdating}
        />
      );
    
    case 'paused':
    case 'hold':
      return <PausedAction onStatusChange={handleStatusChange} isUpdating={isUpdating} />;
    
    case 'completed':
      return (
        <CompletedAction 
          onStatusChange={handleStatusChange}
          onDesignInfo={onDesignInfo}
          isUpdating={isUpdating}
        />
      );
    
    default:
      return null;
  }
};