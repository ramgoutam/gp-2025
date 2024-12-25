import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EvaluationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const EvaluationSection = ({ formData, setFormData }: EvaluationSectionProps) => {
  const sinusOptions = ["Normal", "Clear", "Congested", "Pneumatized"];
  const evaluationOptions = [
    "Focal bone loss",
    "Diffused bone loss",
    "Alveolar resorption",
    "Localized Decay",
    "Gross Decay",
    "Terminal Dentition",
    "Focal Intra-osseous Pathology",
    "Diffused Intra-osseous Pathology"
  ];

  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(`Updating ${field}:`, e.target.value);
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleSelectionChange = (side: 'left' | 'right', option: string) => {
    console.log(`Updating ${side} maxillary sinus:`, option);
    
    // Parse current selections
    let currentSelections: string[] = [];
    try {
      const parsedSelections = JSON.parse(formData.maxillary_sinuses_evaluation[side] || '[]');
      currentSelections = Array.isArray(parsedSelections) ? parsedSelections : [];
    } catch (e) {
      console.error('Error parsing selections:', e);
      currentSelections = [];
    }
    
    // Toggle selection
    const updatedSelections = currentSelections.includes(option)
      ? currentSelections.filter(item => item !== option)
      : [...currentSelections, option];

    console.log(`Updated selections for ${side}:`, updatedSelections);
    
    // Update form data
    setFormData({
      ...formData,
      maxillary_sinuses_evaluation: {
        ...formData.maxillary_sinuses_evaluation,
        [side]: JSON.stringify(updatedSelections)
      }
    });
  };

  const handleEvaluationChange = (option: string) => {
    console.log(`Updating evaluation notes:`, option);
    
    // Parse current selections
    let currentSelections: string[] = [];
    try {
      const parsedSelections = JSON.parse(formData.evaluation_notes || '[]');
      currentSelections = Array.isArray(parsedSelections) ? parsedSelections : [];
    } catch (e) {
      console.error('Error parsing evaluation selections:', e);
      currentSelections = [];
    }
    
    // Toggle selection
    const updatedSelections = currentSelections.includes(option)
      ? currentSelections.filter(item => item !== option)
      : [...currentSelections, option];

    console.log(`Updated evaluation selections:`, updatedSelections);
    
    // Update form data
    setFormData({
      ...formData,
      evaluation_notes: JSON.stringify(updatedSelections)
    });
  };

  const isOptionSelected = (side: 'left' | 'right', option: string) => {
    try {
      const selections = JSON.parse(formData.maxillary_sinuses_evaluation[side] || '[]');
      return Array.isArray(selections) && selections.includes(option);
    } catch (e) {
      console.error('Error checking selection:', e);
      return false;
    }
  };

  const isEvaluationSelected = (option: string) => {
    try {
      const selections = JSON.parse(formData.evaluation_notes || '[]');
      return Array.isArray(selections) && selections.includes(option);
    } catch (e) {
      console.error('Error checking evaluation selection:', e);
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-xl font-bold text-primary">
            Radiographic Findings
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {evaluationOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant={isEvaluationSelected(option) ? "default" : "outline"}
                onClick={() => handleEvaluationChange(option)}
                className="h-auto py-2 px-4 text-sm font-medium transition-all justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

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
          <Label htmlFor="airway_evaluation" className="text-xl font-bold text-primary">
            AIRWAY EVALUATION
          </Label>
          <textarea
            id="airway_evaluation"
            value={formData.airway_evaluation || ""}
            onChange={handleTextChange("airway_evaluation")}
            className="mt-2 min-h-[100px] w-full border rounded p-2"
            placeholder="Enter airway evaluation..."
          />
        </div>
      </div>
    </div>
  );
};