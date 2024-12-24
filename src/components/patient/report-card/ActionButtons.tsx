import { Button } from "@/components/ui/button";
import { Settings, ArrowRight, Stethoscope, CheckCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface ActionButtonsProps {
  script: LabScript;
  onDesignInfo: (script: LabScript) => void;
  onClinicalInfo: () => void;
  onComplete: () => void;
  designInfoStatus?: 'pending' | 'completed';
  clinicalInfoStatus?: 'pending' | 'completed';
}

export const ActionButtons = ({ 
  script, 
  onDesignInfo, 
  onClinicalInfo, 
  onComplete,
  designInfoStatus = 'pending',
  clinicalInfoStatus = 'pending'
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDesignInfo(script)}
        className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
      >
        <Settings className="h-4 w-4" />
        {designInfoStatus === 'completed' ? 'Edit Design Info' : 'Design Info'}
        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onClinicalInfo}
        className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
      >
        <Stethoscope className="h-4 w-4" />
        {clinicalInfoStatus === 'completed' ? 'Edit Clinical Info' : 'Clinical Info'}
        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      </Button>
      {script.designInfo && script.clinicalInfo && script.status !== 'completed' && (
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