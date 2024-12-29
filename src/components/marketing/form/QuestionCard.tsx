import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  title: string;
  type: "radio" | "input";
  options?: string[];
  value: string;
  onChange: (value: string) => void;
  inputType?: string;
  isActive: boolean;
  maxLength?: number;
  pattern?: string;
}

export const QuestionCard = ({
  title,
  type,
  options = [],
  value,
  onChange,
  inputType,
  isActive,
  maxLength,
  pattern,
}: QuestionCardProps) => {
  return (
    <Card className={cn(
      "w-full max-w-2xl mx-auto transition-all duration-500 transform",
      isActive ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
    )}>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {type === "radio" ? (
          <RadioGroup
            value={value}
            onValueChange={onChange}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="flex-grow cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <Input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
            maxLength={maxLength}
            pattern={pattern}
            required
          />
        )}
      </CardContent>
    </Card>
  );
};