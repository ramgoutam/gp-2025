import React from "react";
import { FormSections } from "./lab-script/form/FormSections";
import { useLabScriptForm } from "./lab-script/form/useLabScriptForm";

interface LabScriptFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  patientData?: {
    firstName: string;
    lastName: string;
  };
  patientId?: string;
}

export const LabScriptForm = ({ 
  onSubmit, 
  initialData, 
  isEditing = false,
  patientData,
  patientId
}: LabScriptFormProps) => {
  const {
    formData,
    setFormData,
    fileUploads,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleManufacturingChange,
    onFormSubmit
  } = useLabScriptForm({
    onSubmit,
    initialData,
    isEditing,
    patientData,
    patientId
  });

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      <FormSections
        formData={formData}
        fileUploads={fileUploads}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleManufacturingChange={handleManufacturingChange}
        setFormData={setFormData}
      />
    </form>
  );
};