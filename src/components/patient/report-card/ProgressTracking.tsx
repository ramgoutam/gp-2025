import { ProgressBar } from "../ProgressBar";
import { LabScript } from "@/types/labScript";

interface ProgressTrackingProps {
  script: LabScript;
  designInfoStatus?: 'pending' | 'completed';
  clinicalInfoStatus?: 'pending' | 'completed';
}

export const ProgressTracking = ({ script, designInfoStatus = 'pending', clinicalInfoStatus = 'pending' }: ProgressTrackingProps) => {
  const progressSteps = [
    { 
      label: "Request Created", 
      status: "completed" as const
    },
    { 
      label: "Design Info", 
      status: designInfoStatus === 'completed'
        ? "completed" as const 
        : "current" as const 
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
      status: (designInfoStatus === 'completed' && clinicalInfoStatus === 'completed')
        ? script.status === 'completed'
          ? "completed" as const
          : "current" as const
        : "upcoming" as const 
    }
  ];

  return <ProgressBar steps={progressSteps} />;
};