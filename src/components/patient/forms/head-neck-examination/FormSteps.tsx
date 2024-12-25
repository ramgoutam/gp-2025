import { ProgressBar } from "../../ProgressBar";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface FormStepsProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: { [key: number]: boolean };
}

export const FormSteps = ({ currentStep, totalSteps, completedSteps = {} }: FormStepsProps) => {
  console.log("Form steps - Current step:", currentStep, "Completed steps:", completedSteps);
  
  const steps: Step[] = [
    { 
      label: "Patient Information & Vital Signs", 
      status: getStepStatus(0)
    },
    { 
      label: "Medical History", 
      status: getStepStatus(1)
    },
    { 
      label: "Chief Complaints", 
      status: getStepStatus(2)
    },
    { 
      label: "Extra-Oral Examination", 
      status: getStepStatus(3)
    },
    { 
      label: "Intra-Oral Examination", 
      status: getStepStatus(4)
    },
    { 
      label: "Dental Classification", 
      status: getStepStatus(5)
    },
    { 
      label: "Functional Presentation", 
      status: getStepStatus(6)
    },
    { 
      label: "Tactile & Radiographic", 
      status: getStepStatus(7)
    },
    { 
      label: "Evaluation", 
      status: getStepStatus(8)
    },
    { 
      label: "Guideline Questions", 
      status: getStepStatus(9)
    }
  ];

  function getStepStatus(step: number): "completed" | "current" | "upcoming" {
    if (completedSteps[step]) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
  }

  return <ProgressBar steps={steps} />;
};