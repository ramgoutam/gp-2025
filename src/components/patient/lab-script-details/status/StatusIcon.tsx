import { AlertCircle, CheckCircle, Pause, Play, PlayCircle, StopCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface StatusIconProps {
  status: LabScript['status'];
}

export const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case 'in_progress':
      return <Play className="h-4 w-4 text-blue-600" />;
    case 'paused':
      return <Pause className="h-4 w-4 text-yellow-600" />;
    case 'hold':
      return <StopCircle className="h-4 w-4 text-red-600" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};