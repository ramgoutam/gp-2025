import { ProgressBar } from "../ProgressBar";
import { LabScript } from "@/types/labScript";
import { InfoStatus } from "@/types/reportCard";

interface ProgressTrackingProps {
  script: LabScript;
  designInfoStatus: InfoStatus;
  clinicalInfoStatus: InfoStatus;
  isCompleted: boolean;
}

export const ProgressTracking = ({ 
  script,
  designInfoStatus,
  clinicalInfoStatus,
  isCompleted
}: ProgressTrackingProps) => {
  console.log("Progress tracking status:", { designInfoStatus, clinicalInfoStatus, isCompleted });

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
      status: isCompleted 
        ? "completed" as const
        : (designInfoStatus === 'completed' && clinicalInfoStatus === 'completed')
          ? "current" as const
          : "upcoming" as const
    }
  ];

  return <ProgressBar steps={progressSteps} />;
};