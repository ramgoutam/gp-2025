import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  type: "date" | "select";
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}

export const FormField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  options = [], 
  disabled 
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={label.toLowerCase().replace(/\s+/g, '_')} 
        className="block text-sm font-medium text-gray-700"
      >
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
          <SelectTrigger 
            className="bg-white border-gray-300 focus:ring-2 focus:ring-primary z-50"
          >
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent 
            className="bg-white border border-gray-200 shadow-lg z-[100]"
          >
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="hover:bg-gray-100 focus:bg-gray-100"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};