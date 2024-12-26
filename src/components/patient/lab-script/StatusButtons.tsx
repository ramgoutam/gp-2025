import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, CheckCircle, Edit } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StatusButtonsProps {
  script: LabScript;
}

export const StatusButtons = ({ script }: StatusButtonsProps) => {
  const { toast } = useToast();
  const buttonClass = "p-2 rounded-full transition-all duration-300 hover:scale-110";

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
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  switch (script.status) {
    case 'pending':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600`}
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
            onClick={(e) => handleStatusUpdate(e, 'paused')}
            className={`${buttonClass} hover:bg-orange-50 text-orange-600`}
          >
            <Pause className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'hold')}
            className={`${buttonClass} hover:bg-red-50 text-red-600`}
          >
            <StopCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'completed')}
            className={`${buttonClass} hover:bg-green-50 text-green-600`}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        </div>
      );
    case 'paused':
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'in_progress')}
            className={`${buttonClass} hover:bg-blue-50 text-blue-600`}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'hold')}
            className={`${buttonClass} hover:bg-red-50 text-red-600`}
          >
            <StopCircle className="h-4 w-4" />
          </Button>
        </div>
      );
    case 'hold':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600`}
        >
          <Play className="h-4 w-4" />
        </Button>
      );
    case 'completed':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 group`}
        >
          <Edit className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        </Button>
      );
    default:
      return null;
  }
};