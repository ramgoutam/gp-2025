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
      />
    </div>
  );
};