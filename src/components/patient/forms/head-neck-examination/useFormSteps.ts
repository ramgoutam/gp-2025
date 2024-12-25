import { useState, useEffect } from "react";

export const useFormSteps = (formData?: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 10;

  // Initialize progress based on existing form data
  useEffect(() => {
    if (formData) {
      console.log("Calculating initial step based on form data:", formData);
      // Always start from the first step when editing
      setCurrentStep(0);
    }
  }, [formData]);

  const handleNext = () => {
    console.log("Moving to next step from:", currentStep);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    console.log("Moving to previous step from:", currentStep);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate completion status for progress bar
  const getStepsStatus = () => {
    const steps = [];
    
    // Define the checks for each step
    const stepChecks = [
      { data: formData?.vital_signs, key: 'vital_signs' },
      { data: formData?.medical_history, key: 'medical_history' },
      { data: formData?.chief_complaints, key: 'chief_complaints' },
      { data: formData?.extra_oral_examination, key: 'extra_oral_examination' },
      { data: formData?.intra_oral_examination, key: 'intra_oral_examination' },
      { data: formData?.dental_classification, key: 'dental_classification' },
      { data: formData?.functional_presentation, key: 'functional_presentation' },
      { data: formData?.tactile_observation || formData?.radiographic_presentation, key: 'tactile_radiographic' },
      { data: formData?.evaluation_notes || formData?.maxillary_sinuses_evaluation || formData?.airway_evaluation, key: 'evaluation' },
      { data: formData?.guideline_questions, key: 'guideline_questions' }
    ];

    stepChecks.forEach((check, index) => {
      const isCompleted = check.data && 
        (typeof check.data === 'object' ? Object.keys(check.data).length > 0 : Boolean(check.data));
      
      const status = isCompleted ? "completed" : 
        index === currentStep ? "current" : "upcoming";
      
      steps.push(status);
    });

    return steps;
  };

  return {
    currentStep,
    handleNext,
    handlePrevious,
    totalSteps,
    stepsStatus: getStepsStatus()
  };
};