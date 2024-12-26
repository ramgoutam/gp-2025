import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, CheckCircle, Edit } from "lucide-react";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mapDatabaseLabScript } from "@/types/labScript";

interface StatusButtonsProps {
  script: LabScript;
}

export const StatusButtons = ({ script }: StatusButtonsProps) => {
  const { toast } = useToast();
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const buttonClass = "p-2 rounded-full transition-all duration-500 ease-in-out transform hover:scale-110";

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
      
      // Ensure status is of type LabScriptStatus before mapping
      const typedData = {
        ...data,
        status: data.status as LabScriptStatus
      };
      
      return mapDatabaseLabScript(typedData);
    },
    refetchInterval: 1,
    initialData: script,
  });

  const handleStatusUpdate = async (e: React.MouseEvent, newStatus: LabScript['status']) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Script status changed to ${newStatus.replace('_', ' ')}`
      });
      
      setShowStatusOptions(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStatusOptions(true);
  };

  const status = currentScript?.status || script.status;

  switch (status) {
    case 'pending':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300 animate-fade-in`}
        >
          <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        </Button>
      );
    case 'in_progress':
      return (
        <div className="flex gap-2 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'paused')}
            className={`${buttonClass} hover:bg-orange-50 text-orange-600 transition-all duration-300`}
          >
            <Pause className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'hold')}
            className={`${buttonClass} hover:bg-red-50 text-red-600 transition-all duration-300`}
          >
            <StopCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'completed')}
            className={`${buttonClass} hover:bg-green-50 text-green-600 transition-all duration-300`}
          >
            <CheckCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
        </div>
      );
    case 'paused':
      return (
        <div className="flex gap-2 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'in_progress')}
            className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300`}
          >
            <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'hold')}
            className={`${buttonClass} hover:bg-red-50 text-red-600 transition-all duration-300`}
          >
            <StopCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
        </div>
      );
    case 'hold':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300 animate-fade-in`}
        >
          <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        </Button>
      );
    case 'completed':
      return showStatusOptions ? (
        <div className="flex gap-2 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'in_progress')}
            className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300`}
          >
            <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'hold')}
            className={`${buttonClass} hover:bg-red-50 text-red-600 transition-all duration-300`}
          >
            <StopCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEditClick}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 group transition-all duration-300 animate-fade-in`}
        >
          <Edit className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        </Button>
      );
    default:
      return null;
  }
};