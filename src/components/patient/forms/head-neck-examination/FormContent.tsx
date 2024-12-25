import React from "react";
import { ChiefComplaintsSection } from "./ChiefComplaintsSection";
import { VitalSignsSection } from "./VitalSignsSection";
import { MedicalHistorySection } from "./MedicalHistorySection";
import { ExtraOralSection } from "./ExtraOralSection";
import { IntraOralSection } from "./IntraOralSection";

interface FormContentProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

export const FormContent = ({ currentStep, formData, setFormData }: FormContentProps) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <VitalSignsSection formData={formData} setFormData={setFormData} />;
      case 1:
        return <MedicalHistorySection formData={formData} setFormData={setFormData} />;
      case 2:
        return <ChiefComplaintsSection formData={formData} setFormData={setFormData} />;
      case 3:
        return <IntraOralSection formData={formData} setFormData={setFormData} />;
      case 4:
        return <ExtraOralSection formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[400px]">
      {renderStepContent()}
    </div>
  );
};