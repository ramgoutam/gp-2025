import React from "react";
import { FormHeader } from "./FormHeader";
import { ArchSection } from "./ArchSection";
import { ApplianceSection } from "./ApplianceSection";
import { ShadeSection } from "./ShadeSection";
import { TreatmentSection } from "./TreatmentSection";
import { FormFooter } from "./FormFooter";

interface FormContentProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const FormContent = ({
  formData,
  handleChange,
  handleSelectChange,
  isSubmitting,
  isEditing,
}: FormContentProps) => {
  return (
    <div className="space-y-6">
      <FormHeader
        requestDate={formData.requestDate}
        dueDate={formData.dueDate}
        onChange={handleChange}
      />

      <ArchSection
        value={formData.archType || ""}
        onChange={(value) => handleSelectChange("archType", value)}
      />

      <ApplianceSection
        value={formData.applianceType || ""}
        onChange={(value) => handleSelectChange("applianceType", value)}
      />

      <ShadeSection
        value={formData.shade || ""}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-6">
        <TreatmentSection
          title="Upper"
          treatment={formData.upperTreatment || ""}
          onTreatmentChange={(value) => handleSelectChange("upperTreatment", value)}
          applianceType={formData.applianceType}
        />
        <TreatmentSection
          title="Lower"
          treatment={formData.lowerTreatment || ""}
          onTreatmentChange={(value) => handleSelectChange("lowerTreatment", value)}
          applianceType={formData.applianceType}
        />
      </div>

      <FormFooter
        specificInstructions={formData.specificInstructions || ""}
        onChange={handleChange}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
      />
    </div>
  );
};