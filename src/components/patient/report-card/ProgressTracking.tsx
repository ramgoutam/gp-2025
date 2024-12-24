import { ProgressBar } from "../ProgressBar";
import { LabScript } from "@/types/labScript";
import { DesignInfo, ClinicalInfo } from "@/types/reportCard";

interface ProgressTrackingProps {
  script: LabScript;
  designInfoStatus?: 'pending' | 'completed';
  clinicalInfoStatus?: 'pending' | 'completed';
}

const isDesignInfoComplete = (designInfo?: DesignInfo) => {
  if (!designInfo) return false;
  return !!(
    designInfo.design_date &&
    designInfo.appliance_type &&
    designInfo.upper_treatment &&
    designInfo.lower_treatment &&
    designInfo.implant_library &&
    designInfo.teeth_library
  );
};

const isClinicalInfoComplete = (clinicalInfo?: ClinicalInfo) => {
  if (!clinicalInfo) return false;
  return !!(
    clinicalInfo.insertion_date &&
    clinicalInfo.appliance_fit &&
    clinicalInfo.design_feedback &&
    clinicalInfo.occlusion &&
    clinicalInfo.esthetics &&
    clinicalInfo.adjustments_made &&
    clinicalInfo.material &&
    clinicalInfo.shade
  );
};

export const ProgressTracking = ({ 
  script, 
  designInfoStatus = 'pending', 
  clinicalInfoStatus = 'pending' 
}: ProgressTrackingProps) => {
  const designComplete = isDesignInfoComplete(script.designInfo);
  const clinicalComplete = isClinicalInfoComplete(script.clinicalInfo);

  const progressSteps = [
    { 
      label: "Request Created", 
      status: "completed" as const
    },
    { 
      label: "Design Info", 
      status: designComplete
        ? "completed" as const 
        : "current" as const 
    },
    {
      label: "Clinical Info",
      status: clinicalComplete
        ? "completed" as const 
        : designComplete
        ? "current" as const 
        : "upcoming" as const
    },
    { 
      label: "Completed", 
      status: (designComplete && clinicalComplete)
        ? script.status === 'completed'
          ? "completed" as const
          : "current" as const
        : "upcoming" as const 
    }
  ];

  return <ProgressBar steps={progressSteps} />;
};