import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { LabScript } from "../LabScriptsTab";
import { useToast } from "@/hooks/use-toast";

interface StatusButtonProps {
  status: LabScript['status'];
  onStatusChange: (newStatus: LabScript['status']) => void;
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
              onStatusChange('processing');
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
      
      case 'processing':
      case 'in_progress':
        return [
          <Button
            key="pause"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('paused');
              toast({
                title: "Status Updated",
                description: "Design paused"
              });
            }}
            className="flex items-center gap-2 hover:bg-yellow-50 text-yellow-600 border-yellow-200 mr-2"
          >
            <Pause className="h-4 w-4" />
            Pause Design
          </Button>,
          <Button
            key="hold"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('hold');
              toast({
                title: "Status Updated",
                description: "Design on hold"
              });
            }}
            className="flex items-center gap-2 hover:bg-red-50 text-red-600 border-red-200 mr-2"
          >
            <StopCircle className="h-4 w-4" />
            Hold Design
          </Button>,
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
      
      case 'paused':
      case 'hold':
        return [
          <Button
            key="resume"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('in_progress');
              toast({
                title: "Status Updated",
                description: "Design resumed"
              });
            }}
            className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200"
          >
            <PlayCircle className="h-4 w-4" />
            Resume Design
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