import { Button } from "@/components/ui/button";
import { Pause, StopCircle, CheckCircle } from "lucide-react";
import { LabScriptStatus } from "@/types/labScript";

export interface InProgressActionsProps {
  onStatusChange: (newStatus: LabScriptStatus) => void;
  onDesignInfo: () => void;
  isUpdating: boolean;
}

export const InProgressActions = ({ 
  onStatusChange, 
  onDesignInfo,
  isUpdating 
}: InProgressActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusChange('paused')}
          className="hover:bg-yellow-50 text-yellow-600 border-yellow-200 group"
          disabled={isUpdating}
        >
          <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Pause
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusChange('hold')}
          className="hover:bg-red-50 text-red-600 border-red-200 group"
          disabled={isUpdating}
        >
          <StopCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Hold
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusChange('completed')}
          className="hover:bg-green-50 text-green-600 border-green-200 group"
          disabled={isUpdating}
        >
          <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          Complete
        </Button>
      </div>
    </div>
  );
};