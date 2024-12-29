import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
  currentStep: number;
  totalSteps: number;
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
  currentStep,
  totalSteps,
}: QuestionCardProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto transition-all duration-500 transform",
      isActive ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
    )}>
      <Progress value={progress} className="mb-8" />
      
      <Card className="bg-white shadow-lg border-none">
        <CardContent className="p-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 leading-tight">
            {title}
          </h3>
          
          {type === "radio" ? (
            <RadioGroup
              value={value}
              onValueChange={onChange}
              className="space-y-4"
            >
              {options.map((option) => (
                <div 
                  key={option} 
                  className="transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-primary-50 border-2 border-transparent hover:border-primary-200 transition-colors cursor-pointer">
                    <RadioGroupItem value={option} id={option} className="text-primary" />
                    <Label 
                      htmlFor={option} 
                      className="flex-grow cursor-pointer text-lg text-gray-700 font-medium"
                    >
                      {option}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-4">
              <Input
                type={inputType}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full text-lg p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-primary"
                maxLength={maxLength}
                pattern={pattern}
                placeholder={`Enter your ${title.toLowerCase()}`}
                required
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-sm text-gray-500">
        Question {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};