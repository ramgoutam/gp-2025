import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TreatmentSectionProps {
  title: "Upper" | "Lower";
  treatment: string;
  onTreatmentChange: (value: string) => void;
  applianceType?: string;
}

export const TreatmentSection = ({
  title,
  treatment,
  onTreatmentChange,
  applianceType
}: TreatmentSectionProps) => {
  const TREATMENT_OPTIONS = ["None", "Full Arch Fixed", "Denture", "Crown"] as const;
  const NIGHTGUARD_OPTIONS = ["None", "Nightguard"] as const;

  const options = applianceType === "Nightguard" ? NIGHTGUARD_OPTIONS : TREATMENT_OPTIONS;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>
      <Select value={treatment} onValueChange={onTreatmentChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${title.toLowerCase()} treatment`} />
        </SelectTrigger>
        <SelectContent className="bg-white z-[200]">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="hover:bg-gray-100">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};