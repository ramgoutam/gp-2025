import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TREATMENT_OPTIONS = ["None", "Full Arch Fixed", "Denture", "Crown", "Nightguard"] as const;

interface TreatmentSectionProps {
  title: "Upper" | "Lower";
  treatment: string;
  onTreatmentChange: (value: string) => void;
}

export const TreatmentSection = ({
  title,
  treatment,
  onTreatmentChange,
}: TreatmentSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>
      <Select value={treatment} onValueChange={onTreatmentChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${title.toLowerCase()} treatment`} />
        </SelectTrigger>
        <SelectContent className="bg-white z-[200]">
          {TREATMENT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option} className="hover:bg-gray-100">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};