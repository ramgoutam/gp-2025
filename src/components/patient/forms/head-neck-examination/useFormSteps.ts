import { useState, useEffect } from "react";

export const useFormSteps = (formData?: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 10;

  // Initialize progress based on existing form data
  useEffect(() => {
    if (formData) {
      console.log("Calculating initial step based on form data:", formData);
      let lastCompletedStep = 0;

      // Check each section in order to find the last completed step
      if (formData.vital_signs && Object.keys(formData.vital_signs).length > 0) lastCompletedStep = 1;
      if (formData.medical_history && Object.keys(formData.medical_history).length > 0) lastCompletedStep = 2;
      if (formData.chief_complaints && Object.keys(formData.chief_complaints).length > 0) lastCompletedStep = 3;
      if (formData.extra_oral_examination && Object.keys(formData.extra_oral_examination).length > 0) lastCompletedStep = 4;
      if (formData.intra_oral_examination && Object.keys(formData.intra_oral_examination).length > 0) lastCompletedStep = 5;
      if (formData.dental_classification && Object.keys(formData.dental_classification).length > 0) lastCompletedStep = 6;
      if (formData.functional_presentation && Object.keys(formData.functional_presentation).length > 0) lastCompletedStep = 7;
      if ((formData.tactile_observation && Object.keys(formData.tactile_observation).length > 0) || 
          (formData.radiographic_presentation && Object.keys(formData.radiographic_presentation).length > 0)) lastCompletedStep = 8;
      if (formData.evaluation_notes || formData.maxillary_sinuses_evaluation || formData.airway_evaluation) lastCompletedStep = 9;
      if (formData.guideline_questions && Object.keys(formData.guideline_questions).length > 0) lastCompletedStep = 10;

      console.log("Setting initial step to:", lastCompletedStep);
      setCurrentStep(lastCompletedStep);
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

  return {
    currentStep,
    handleNext,
    handlePrevious,
    totalSteps,
  };
};