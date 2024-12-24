import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ActionsTakenSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const ActionsTakenSection = ({ value, onChange }: ActionsTakenSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="actionsTaken">Designer Actions & Changes Made</Label>
      <Textarea
        id="actionsTaken"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
      />
    </div>
  );
};