import { AlertCircle, FileCheck } from "lucide-react";
import { BaseButton } from "./BaseButton";
import { LabScript } from "@/types/labScript";

interface CompletedStateButtonsProps {
  script: LabScript;
  onDesignInfo: () => void;
  onStatusChange: (status: LabScript['status']) => void;
}

export const CompletedStateButtons = ({ 
  onDesignInfo, 
  onStatusChange 
}: CompletedStateButtonsProps) => {
  return (
    <div className="flex gap-2 animate-fade-in">
      <BaseButton
        onClick={onDesignInfo}
        icon={FileCheck}
        label="Complete Design Info"
        className="hover:bg-blue-50 text-blue-600 border-blue-200 group"
      />
      <BaseButton
        onClick={() => onStatusChange('in_progress')}
        icon={AlertCircle}
        label="Edit Status"
        className="hover:bg-blue-50 text-blue-600 border-blue-200 group"
      />
    </div>
  );
};