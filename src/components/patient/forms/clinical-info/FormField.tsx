import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldProps {
  label: string;
  type: "date" | "select";
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}

export const FormField = ({ label, type, value, onChange, options = [], disabled }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '_')} className="block text-sm font-medium text-gray-700">
        {label}
      </Label>
      {type === "date" ? (
        <Input
          id={label.toLowerCase().replace(/\s+/g, '_')}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      ) : (
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};