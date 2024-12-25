import { ProgressBar } from "../../ProgressBar";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface FormStepsProps {
  currentStep: number;
  totalSteps: number;
  formData: any;
}

export const FormSteps = ({ currentStep, formData }: FormStepsProps) => {
  // Helper function to determine step status
  const getStepStatus = (stepIndex: number, data: any): "completed" | "current" | "upcoming" => {
    if (currentStep === stepIndex) return "current";
    if (currentStep > stepIndex) return "completed";
    
    // Check if there's data for this step
    const stepData = getStepData(stepIndex, data);
    if (stepData && Object.keys(stepData).length > 0) return "completed";
    
    return "upcoming";
  };

  // Helper function to get data for a specific step
  const getStepData = (stepIndex: number, data: any) => {
    switch (stepIndex) {
      case 0: return data?.vital_signs;
      case 1: return data?.medical_history;
      case 2: return data?.chief_complaints;
      case 3: return data?.extra_oral_examination;
      case 4: return data?.intra_oral_examination;
      case 5: return data?.dental_classification;
      case 6: return data?.functional_presentation;
      case 7: return {
        ...data?.tactile_observation,
        ...data?.radiographic_presentation
      };
      case 8: return {
        evaluation_notes: data?.evaluation_notes,
        maxillary_sinuses_evaluation: data?.maxillary_sinuses_evaluation,
        airway_evaluation: data?.airway_evaluation
      };
      case 9: return data?.guideline_questions;
      default: return null;
    }
  };

  const steps: Step[] = [
    { 
      label: "Patient Information & Vital Signs", 
      status: getStepStatus(0, formData)
    },
    { 
      label: "Medical History", 
      status: getStepStatus(1, formData)
    },
    { 
      label: "Chief Complaints", 
      status: getStepStatus(2, formData)
    },
    { 
      label: "Extra-Oral Examination", 
      status: getStepStatus(3, formData)
    },
    { 
      label: "Intra-Oral Examination", 
      status: getStepStatus(4, formData)
    },
    { 
      label: "Dental Classification", 
      status: getStepStatus(5, formData)
    },
    { 
      label: "Functional Presentation", 
      status: getStepStatus(6, formData)
    },
    { 
      label: "Tactile & Radiographic", 
      status: getStepStatus(7, formData)
    },
    { 
      label: "Evaluation", 
      status: getStepStatus(8, formData)
    },
    { 
      label: "Guideline Questions", 
      status: getStepStatus(9, formData)
    }
  ];

  console.log("Progress bar steps:", steps);
  return <ProgressBar steps={steps} />;
};