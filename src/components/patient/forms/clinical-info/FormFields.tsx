import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FIT_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const DESIGN_FEEDBACK_OPTIONS = ["Neutral", "Positive", "Negative"];
const OCCLUSION_OPTIONS = ["Perfect", "Slight Adjustment Needed", "Major Adjustment Needed"];
const ESTHETICS_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const ADJUSTMENTS_OPTIONS = ["None", "Minor", "Major"];
const MATERIAL_OPTIONS = ["PMMA", "Zirconia", "Metal", "Other"];
const SHADE_OPTIONS = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2"];

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
}

export const FormFields = ({ formData, onFieldChange }: FormFieldsProps) => {
  const renderSelect = (
    label: string,
    id: keyof typeof formData,
    options: string[]
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={formData[id]}
        onValueChange={(value) => onFieldChange(id, value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-white z-[200]">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="insertion_date">Insertion Date</Label>
        <input
          id="insertion_date"
          type="date"
          value={formData.insertion_date}
          onChange={(e) => onFieldChange("insertion_date", e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      {renderSelect("Appliance Fit", "appliance_fit", FIT_OPTIONS)}
      {renderSelect("Design Feedback", "design_feedback", DESIGN_FEEDBACK_OPTIONS)}
      {renderSelect("Occlusion", "occlusion", OCCLUSION_OPTIONS)}
      {renderSelect("Esthetics", "esthetics", ESTHETICS_OPTIONS)}
      {renderSelect("Adjustments Made", "adjustments_made", ADJUSTMENTS_OPTIONS)}
      {renderSelect("Material", "material", MATERIAL_OPTIONS)}
      {renderSelect("Shade", "shade", SHADE_OPTIONS)}
    </div>
  );
};