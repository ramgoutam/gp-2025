import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DesignDateSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const DesignDateSection = ({ value, onChange }: DesignDateSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="designDate">Design Date</Label>
      <Input
        id="designDate"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus:ring-0 focus:ring-offset-0 focus:border-gray-300 focus:outline-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-datetime-edit-fields-wrapper]:text-gray-900"
      />
    </div>
  );
};