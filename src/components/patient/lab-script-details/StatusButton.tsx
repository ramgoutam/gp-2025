import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";

interface StatusButtonProps {
  status: LabScriptStatus;
  onStatusChange: (newStatus: LabScriptStatus) => void;
}

export const StatusButton = ({ status, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();

  const getStatusButtons = () => {
    switch (status) {
      case 'pending':
        return [
          <Button
            key="start"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('in_progress');
              toast({
                title: "Status Updated",
                description: "Design started"
              });
            }}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <Play className="h-4 w-4 text-primary" />
            Start Design
          </Button>
        ];
      
      case 'in_progress':
        return [
          <Button
            key="complete"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('completed');
              toast({
                title: "Status Updated",
                description: "Design completed"
              });
            }}
            className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200"
          >
            <CheckCircle className="h-4 w-4" />
            Complete Design
          </Button>
        ];
      
      case 'completed':
        return null;
      
      default:
        return [
          <Button
            key="default"
            variant="outline"
            size="sm"
            disabled
            className="flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Pending
          </Button>
        ];
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {getStatusButtons()}
    </div>
  );
};