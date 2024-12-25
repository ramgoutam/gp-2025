import { ProgressBar } from "../../ProgressBar";
import { useFormSteps } from "./useFormSteps";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface FormStepsProps {
  currentStep: number;
  totalSteps: number;
  formData: any;
  onStepChange?: (step: number) => void;
  completedSteps: number[];
}

export const FormSteps = ({ currentStep, formData, onStepChange, completedSteps }: FormStepsProps) => {
  // Helper function to determine if an object has any filled fields
  const hasFilledFields = (obj: any): boolean => {
    if (!obj) return false;
    return Object.keys(obj).some(key => {
      const value = obj[key];
      if (typeof value === 'object') {
        return hasFilledFields(value);
      }
      return value !== null && value !== undefined && value !== '';
    });
  };

  // Helper function to determine step status
  const getStepStatus = (stepIndex: number): "completed" | "current" | "upcoming" => {
    // If the step is in completedSteps array, mark it as completed
    if (completedSteps.includes(stepIndex)) {
      return "completed";
    }
    
    // If we're on this step
    if (currentStep === stepIndex) {
      return "current";
    }
    
    // If we're past this step but no data, mark as upcoming
    return "upcoming";
  };

  // Helper function to get data for a specific step
  const getStepData = (stepIndex: number) => {
    console.log("Getting data for step:", stepIndex);
    switch (stepIndex) {
      case 0: 
        console.log("Vital signs data:", formData?.vital_signs);
        return formData?.vital_signs;
      case 1: 
        console.log("Medical history data:", formData?.medical_history);
        return formData?.medical_history;
      case 2: 
        console.log("Chief complaints data:", formData?.chief_complaints);
        return formData?.chief_complaints;
      case 3: 
        console.log("Extra oral data:", formData?.extra_oral_examination);
        return formData?.extra_oral_examination;
      case 4: 
        console.log("Intra oral data:", formData?.intra_oral_examination);
        return formData?.intra_oral_examination;
      case 5: 
        console.log("Dental classification data:", formData?.dental_classification);
        return formData?.dental_classification;
      case 6: 
        console.log("Functional presentation data:", formData?.functional_presentation);
        return formData?.functional_presentation;
      case 7: 
        const combinedData = {
          tactile: formData?.tactile_observation,
          radiographic: formData?.radiographic_presentation
        };
        console.log("Combined tactile & radiographic data:", combinedData);
        return combinedData;
      case 8: 
        const evaluationData = {
          evaluation_notes: formData?.evaluation_notes,
          maxillary_sinuses_evaluation: formData?.maxillary_sinuses_evaluation,
          airway_evaluation: formData?.airway_evaluation
        };
        console.log("Evaluation data:", evaluationData);
        return evaluationData;
      case 9: 
        console.log("Guideline questions data:", formData?.guideline_questions);
        return formData?.guideline_questions;
      default: return null;
    }
  };

  const handleStepClick = (stepIndex: number) => {
    console.log("Step clicked:", stepIndex);
    onStepChange?.(stepIndex);
  };

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

  console.log("Progress bar steps:", steps);
  return <ProgressBar steps={steps} onStepClick={handleStepClick} />;
};