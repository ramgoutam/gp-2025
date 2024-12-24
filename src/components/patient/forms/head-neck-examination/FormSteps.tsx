import React from "react";

interface FormStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const FormSteps = ({ currentStep, totalSteps }: FormStepsProps) => {
  const steps = [
    {
      title: "Patient Information & Vital Signs",
      description: "Basic patient details and vital measurements",
    },
    {
      title: "Medical History",
      description: "Past medical conditions and current medications",
    },
    {
      title: "Clinical Examination",
      description: "Extra-oral and intra-oral examination details",
    },
    {
      title: "Observations & Analysis",
      description: "Clinical observations and diagnostic findings",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {steps[currentStep].title}
        </h3>
        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
          <div
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
          />
        </div>
      </div>
      <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
    </div>
  );
};