import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface EvaluationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const EvaluationSection = ({ formData, setFormData }: EvaluationSectionProps) => {
  const sinusOptions = ["Normal", "Clear", "Congested", "Pneumatized"];

  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(`Updating ${field}:`, e.target.value);
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleCheckboxChange = (side: 'left' | 'right', option: string) => {
    console.log(`Updating ${side} maxillary sinus:`, option);
    setFormData({
      ...formData,
      maxillary_sinuses_evaluation: {
        ...formData.maxillary_sinuses_evaluation,
        [side]: option
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="evaluation_notes" className="text-base font-semibold">
            Radiographic Examination
          </Label>
          <Textarea
            id="evaluation_notes"
            value={formData.evaluation_notes || ""}
            onChange={handleTextChange("evaluation_notes")}
            className="mt-2 min-h-[100px]"
            placeholder="Enter evaluation notes..."
          />
        </div>

        {/* New headline for Maxillary Sinus Evaluation */}
        <h2 className="text-xl font-bold text-primary mb-4">Maxillary Sinus Evaluation</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">
              Left Maxillary Sinus
            </Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {sinusOptions.map((option) => (
                <div key={`left-${option}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`left-${option}`}
                    checked={formData.maxillary_sinuses_evaluation?.left === option}
                    onCheckedChange={() => handleCheckboxChange('left', option)}
                  />
                  <Label
                    htmlFor={`left-${option}`}
                    className="text-sm font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">
              Right Maxillary Sinus
            </Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {sinusOptions.map((option) => (
                <div key={`right-${option}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`right-${option}`}
                    checked={formData.maxillary_sinuses_evaluation?.right === option}
                    onCheckedChange={() => handleCheckboxChange('right', option)}
                  />
                  <Label
                    htmlFor={`right-${option}`}
                    className="text-sm font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="airway_evaluation" className="text-base font-semibold">
            AIRWAY EVALUATION
          </Label>
          <Textarea
            id="airway_evaluation"
            value={formData.airway_evaluation || ""}
            onChange={handleTextChange("airway_evaluation")}
            className="mt-2 min-h-[100px]"
            placeholder="Enter airway evaluation..."
          />
        </div>
      </div>
    </div>
  );
};