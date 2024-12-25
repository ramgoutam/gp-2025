import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

  const handleSelectionChange = (side: 'left' | 'right', option: string) => {
    console.log(`Updating ${side} maxillary sinus:`, option);
    // Initialize current selections, ensuring we have a valid array
    let currentSelections: string[] = [];
    try {
      if (formData.maxillary_sinuses_evaluation?.[side]) {
        currentSelections = JSON.parse(formData.maxillary_sinuses_evaluation[side]);
        if (!Array.isArray(currentSelections)) {
          currentSelections = [];
        }
      }
    } catch (e) {
      console.error('Error parsing selections, resetting to empty array:', e);
      currentSelections = [];
    }
    
    // Toggle the selection
    const updatedSelections = currentSelections.includes(option)
      ? currentSelections.filter(item => item !== option)
      : [...currentSelections, option];

    // Update the form data with stringified array
    setFormData({
      ...formData,
      maxillary_sinuses_evaluation: {
        ...formData.maxillary_sinuses_evaluation,
        [side]: JSON.stringify(updatedSelections)
      }
    });
  };

  const isOptionSelected = (side: 'left' | 'right', option: string) => {
    try {
      if (!formData.maxillary_sinuses_evaluation?.[side]) {
        return false;
      }
      const selections = JSON.parse(formData.maxillary_sinuses_evaluation[side]);
      return Array.isArray(selections) && selections.includes(option);
    } catch (e) {
      console.error('Error parsing selections:', e);
      return false;
    }
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
                <Button
                  key={`left-${option}`}
                  type="button"
                  variant={isOptionSelected('left', option) ? "default" : "outline"}
                  onClick={() => handleSelectionChange('left', option)}
                  className="h-auto py-2 px-4 text-sm font-medium transition-all justify-start"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">
              Right Maxillary Sinus
            </Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {sinusOptions.map((option) => (
                <Button
                  key={`right-${option}`}
                  type="button"
                  variant={isOptionSelected('right', option) ? "default" : "outline"}
                  onClick={() => handleSelectionChange('right', option)}
                  className="h-auto py-2 px-4 text-sm font-medium transition-all justify-start"
                >
                  {option}
                </Button>
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