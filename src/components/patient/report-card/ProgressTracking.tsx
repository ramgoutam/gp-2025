import { ProgressBar } from "../ProgressBar";
import { LabScript } from "@/types/labScript";
import { InfoStatus } from "@/types/reportCard";

interface ProgressTrackingProps {
  script: LabScript;
  designInfoStatus: InfoStatus;
  clinicalInfoStatus: InfoStatus;
}

export const ProgressTracking = ({ 
  script,
  designInfoStatus,
  clinicalInfoStatus
}: ProgressTrackingProps) => {
  const progressSteps = [
    { 
      label: "Request Created", 
      status: "completed" as const 
    },
    { 
      label: "Design Info", 
      status: designInfoStatus === 'completed' ? "completed" as const : "current" as const 
    },
    { 
      label: "Clinical Info", 
      status: clinicalInfoStatus === 'completed'
        ? "completed" as const 
        : designInfoStatus === 'completed'
          ? "current" as const 
          : "upcoming" as const 
    },
    { 
      label: "Completed", 
      status: script.status === 'completed' 
        ? "completed" as const 
        : "upcoming" as const 
    }
  ];

  return <ProgressBar steps={progressSteps} />;
};