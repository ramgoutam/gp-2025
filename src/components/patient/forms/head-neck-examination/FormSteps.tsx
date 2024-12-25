import { ProgressBar } from "../../ProgressBar";

interface FormStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const FormSteps = ({ currentStep }: FormStepsProps) => {
  const steps = [
    { 
      label: "Patient Information & Vital Signs", 
      status: currentStep === 0 ? "current" : currentStep > 0 ? "completed" : "upcoming" 
    },
    { 
      label: "Medical History", 
      status: currentStep === 1 ? "current" : currentStep > 1 ? "completed" : "upcoming" 
    },
    { 
      label: "Chief Complaints", 
      status: currentStep === 2 ? "current" : currentStep > 2 ? "completed" : "upcoming" 
    },
    { 
      label: "Extra-Oral Examination", 
      status: currentStep === 3 ? "current" : currentStep > 3 ? "completed" : "upcoming" 
    },
    { 
      label: "Intra-Oral Examination", 
      status: currentStep === 4 ? "current" : currentStep > 4 ? "completed" : "upcoming" 
    },
    { 
      label: "Dental Classification", 
      status: currentStep === 5 ? "current" : currentStep > 5 ? "completed" : "upcoming" 
    }
  ];

  return <ProgressBar steps={steps} />;
};