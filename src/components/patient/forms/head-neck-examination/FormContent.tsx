import React from "react";

interface FormContentProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

export const FormContent = ({ currentStep, formData, setFormData }: FormContentProps) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              This section will contain fields for patient information and vital signs
            </h4>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              This section will contain fields for medical history
            </h4>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              This section will contain fields for clinical examination
            </h4>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              This section will contain fields for observations and analysis
            </h4>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[300px]">
      {renderStepContent()}
    </div>
  );
};