import React from "react";
import { FormField } from "./FormField";
import { FIELD_OPTIONS } from "./fieldOptions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldsProps {
  formData: {
    insertion_date: string;
    appliance_fit: string;
    design_feedback: string;
    occlusion: string;
    esthetics: string;
    adjustments_made: string;
    material: string;
    shade: string;
  };
  onFieldChange: (field: string, value: string) => void;
  isSubmitting?: boolean;
}

export const FormFields = ({ formData, onFieldChange, isSubmitting }: FormFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="insertion_date">Insertion Date</Label>
        <Input
          id="insertion_date"
          type="date"
          value={formData.insertion_date}
          onChange={(e) => onFieldChange("insertion_date", e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <FormField
        label="Appliance Fit"
        type="select"
        value={formData.appliance_fit}
        onChange={(value) => onFieldChange("appliance_fit", value)}
        options={FIELD_OPTIONS.appliance_fit}
        disabled={isSubmitting}
      />

      <FormField
        label="Design Feedback"
        type="select"
        value={formData.design_feedback}
        onChange={(value) => onFieldChange("design_feedback", value)}
        options={FIELD_OPTIONS.design_feedback}
        disabled={isSubmitting}
      />

      <FormField
        label="Occlusion"
        type="select"
        value={formData.occlusion}
        onChange={(value) => onFieldChange("occlusion", value)}
        options={FIELD_OPTIONS.occlusion}
        disabled={isSubmitting}
      />

      <FormField
        label="Esthetics"
        type="select"
        value={formData.esthetics}
        onChange={(value) => onFieldChange("esthetics", value)}
        options={FIELD_OPTIONS.esthetics}
        disabled={isSubmitting}
      />

      <FormField
        label="Adjustments Made"
        type="select"
        value={formData.adjustments_made}
        onChange={(value) => onFieldChange("adjustments_made", value)}
        options={FIELD_OPTIONS.adjustments_made}
        disabled={isSubmitting}
      />

      <FormField
        label="Material"
        type="select"
        value={formData.material}
        onChange={(value) => onFieldChange("material", value)}
        options={FIELD_OPTIONS.material}
        disabled={isSubmitting}
      />

      <FormField
        label="Shade"
        type="select"
        value={formData.shade}
        onChange={(value) => onFieldChange("shade", value)}
        options={FIELD_OPTIONS.shade}
        disabled={isSubmitting}
      />
    </div>
  );
};