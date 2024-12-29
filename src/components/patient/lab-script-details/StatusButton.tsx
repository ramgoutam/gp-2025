import { Button } from "@/components/ui/button";
import { Play, Pause, PlayCircle, AlertCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";
import { CompleteButton } from "./buttons/CompleteButton";
import { HoldButton } from "./buttons/HoldButton";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();

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

        return mapDatabaseLabScript(data);
      } catch (error) {
        console.error("Unexpected error fetching script status:", error);
        return script;
      }
    },
    refetchInterval: 1000,
    initialData: script,
  });

  const status = currentScript?.status || script.status;

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);

      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
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
    }
  };

  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  const renderButton = () => {
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
              <HoldButton script={script} onStatusChange={onStatusChange} />
              <CompleteButton script={script} onStatusChange={onStatusChange} />
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

  return renderButton();
};