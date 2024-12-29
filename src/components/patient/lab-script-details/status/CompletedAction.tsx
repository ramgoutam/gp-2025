import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface CompletedActionProps {
  onStatusChange: (status: LabScript['status']) => void;
  onDesignInfo?: () => void;
  isUpdating: boolean;
}

export const CompletedAction = ({ onStatusChange, onDesignInfo, isUpdating }: CompletedActionProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onStatusChange('in_progress')}
        className="transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 text-blue-600 border-blue-200 group animate-fade-in"
        disabled={isUpdating}
      >
        <AlertCircle className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
        Edit Status
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDesignInfo}
        className="transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 text-blue-600 border-blue-200 group"
        disabled={isUpdating}
      >
        Add Design Info
      </Button>
    </div>
  );
};