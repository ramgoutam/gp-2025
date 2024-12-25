import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EvaluationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const EvaluationSection = ({ formData, setFormData }: EvaluationSectionProps) => {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(`Updating ${field}:`, e.target.value);
    setFormData({
      ...formData,
      [field]: e.target.value
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
            onChange={handleChange("evaluation_notes")}
            className="mt-2 min-h-[100px]"
            placeholder="Enter evaluation notes..."
          />
        </div>

        <div>
          <Label htmlFor="maxillary_sinuses_evaluation" className="text-base font-semibold">
            MAXILLARY SINUSES EVALUATION
          </Label>
          <Textarea
            id="maxillary_sinuses_evaluation"
            value={formData.maxillary_sinuses_evaluation || ""}
            onChange={handleChange("maxillary_sinuses_evaluation")}
            className="mt-2 min-h-[100px]"
            placeholder="Enter maxillary sinuses evaluation..."
          />
        </div>

        <div>
          <Label htmlFor="airway_evaluation" className="text-base font-semibold">
            AIRWAY EVALUATION
          </Label>
          <Textarea
            id="airway_evaluation"
            value={formData.airway_evaluation || ""}
            onChange={handleChange("airway_evaluation")}
            className="mt-2 min-h-[100px]"
            placeholder="Enter airway evaluation..."
          />
        </div>
      </div>
    </div>
  );
};
