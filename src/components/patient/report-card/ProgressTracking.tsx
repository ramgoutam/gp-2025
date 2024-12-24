import { ProgressBar } from "../ProgressBar";
import { LabScript } from "@/types/labScript";

interface ProgressTrackingProps {
  script: LabScript;
}

export const ProgressTracking = ({ script }: ProgressTrackingProps) => {
  const progressSteps = [
    { 
      label: "Request Created", 
      status: "completed" as const
    },
    { 
      label: "Design Info", 
      status: script.designInfo 
        ? "completed" as const 
        : "current" as const 
    },
    {
      label: "Clinical Info",
      status: script.clinicalInfo 
        ? "completed" as const 
        : script.designInfo
        ? "current" as const 
        : "upcoming" as const
    },
    { 
      label: "Completed", 
      status: (script.designInfo && script.clinicalInfo)
        ? script.status === 'completed'
          ? "completed" as const
          : "current" as const
        : "upcoming" as const 
    }
  ];

  return <ProgressBar steps={progressSteps} />;
};