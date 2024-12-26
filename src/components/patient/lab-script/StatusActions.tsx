import { Button } from "@/components/ui/button";
import { Play, Pause, PauseCircle, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { useQueryClient } from "@tanstack/react-query";

interface StatusActionsProps {
  script: LabScript;
  onStatusUpdate?: () => void;
}

export const StatusActions = ({ script, onStatusUpdate }: StatusActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (newStatus: LabScript["status"]) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);
      
      const { data, error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id)
        .select()
        .single();

      if (error) throw error;

      console.log("Status updated successfully:", data);

      // Invalidate and refetch queries that depend on this lab script
      queryClient.invalidateQueries({ queryKey: ['labScripts'] });
      queryClient.invalidateQueries({ queryKey: ['labScript', script.id] });

      toast({
        title: "Status Updated",
        description: `Lab script status changed to ${newStatus.replace("_", " ")}`
      });

      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const buttonStyles = "h-8 w-8 p-0";
  
  switch (script.status) {
    case 'pending':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleStatusUpdate('in_progress')}
          className={buttonStyles}
          title="Start"
        >
          <Play className="h-4 w-4" />
        </Button>
      );
    case 'in_progress':
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusUpdate('paused')}
            className={buttonStyles}
            title="Pause"
          >
            <Pause className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusUpdate('hold')}
            className={buttonStyles}
            title="Hold"
          >
            <PauseCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusUpdate('completed')}
            className={buttonStyles}
            title="Complete"
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
        </div>
      );
    case 'paused':
    case 'hold':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleStatusUpdate('in_progress')}
          className={buttonStyles}
          title="Resume"
        >
          <Play className="h-4 w-4" />
        </Button>
      );
    default:
      return null;
  }
};