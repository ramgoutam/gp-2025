import { Button } from "@/components/ui/button";
import { Settings, ArrowRight, Stethoscope, CheckCircle, PenTool } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { InfoStatus } from "@/types/reportCard";

interface ActionButtonsProps {
  script: LabScript;
  onDesignInfo: (script: LabScript) => void;
  onClinicalInfo: () => void;
  onComplete: () => void;
  designInfoStatus?: InfoStatus;
  clinicalInfoStatus?: InfoStatus;
}

export const ActionButtons = ({ 
  script, 
  onDesignInfo, 
  onClinicalInfo, 
  onComplete,
  designInfoStatus = 'pending',
  clinicalInfoStatus = 'pending'
}: ActionButtonsProps) => {
  const isDesignInfoCompleted = designInfoStatus === 'completed';
  const isClinicalInfoCompleted = clinicalInfoStatus === 'completed';
  const showCompleteButton = isDesignInfoCompleted && isClinicalInfoCompleted && script.status !== 'completed';

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDesignInfo(script)}
        className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
      >
        {isDesignInfoCompleted ? (
          <PenTool className="h-4 w-4" />
        ) : (
          <Settings className="h-4 w-4" />
        )}
        {isDesignInfoCompleted ? 'Edit Design Info' : 'Add Design Info'}
        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onClinicalInfo}
        className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
      >
        <Stethoscope className="h-4 w-4" />
        {isClinicalInfoCompleted ? 'Edit Clinical Info' : 'Add Clinical Info'}
        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      </Button>
      {showCompleteButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={onComplete}
          className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200 group-hover:border-green-300 transition-all duration-300"
        >
          <CheckCircle className="h-4 w-4" />
          Complete Report
          <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
        </Button>
      )}
    </div>
  );
};