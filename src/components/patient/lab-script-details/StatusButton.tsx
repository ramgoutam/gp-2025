import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";

interface StatusButtonProps {
  script: LabScript;
  status: LabScript['status'];
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, status: initialStatus, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();

  // Add real-time query for script status with proper type handling
  const { data: currentScript } = useQuery({
    queryKey: ['scriptStatus', script.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('id', script.id)
        .single();

      if (error) throw error;
      return mapDatabaseLabScript(data);
    },
    refetchInterval: 1,
    initialData: script,
  });

  const status = currentScript?.status || initialStatus;

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    try {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id);

      if (error) throw error;
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
        <div className="flex gap-2 animate-fade-in">
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
            onClick={() => handleStatusChange('hold')}
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