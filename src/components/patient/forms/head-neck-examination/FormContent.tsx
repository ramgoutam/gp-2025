import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DiagramSection } from "./DiagramSection";
import { IntraOralSection } from "./IntraOralSection";

interface FormContentProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

export const FormContent = ({ currentStep, formData, setFormData }: FormContentProps) => {
  const handleInputChange = (field: string, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.vital_signs?.height || ""}
                  onChange={(e) => handleInputChange("vital_signs", {
                    ...formData.vital_signs,
                    height: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.vital_signs?.weight || ""}
                  onChange={(e) => handleInputChange("vital_signs", {
                    ...formData.vital_signs,
                    weight: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood_pressure">Blood Pressure</Label>
                <Input
                  id="blood_pressure"
                  value={formData.vital_signs?.blood_pressure || ""}
                  onChange={(e) => handleInputChange("vital_signs", {
                    ...formData.vital_signs,
                    blood_pressure: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.vital_signs?.temperature || ""}
                  onChange={(e) => handleInputChange("vital_signs", {
                    ...formData.vital_signs,
                    temperature: e.target.value
                  })}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <IntraOralSection formData={formData} setFormData={setFormData} />
            <DiagramSection
              type="mallampati"
              value={formData.intra_oral_examination?.mallampati_score || ""}
              onChange={(value) => handleInputChange("intra_oral_examination", {
                ...formData.intra_oral_examination,
                mallampati_score: value
              })}
            />
            <DiagramSection
              type="malocclusion"
              value={formData.intra_oral_examination?.malocclusion || ""}
              onChange={(value) => handleInputChange("intra_oral_examination", {
                ...formData.intra_oral_examination,
                malocclusion: value
              })}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Clinical Observations</Label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "minimal_atrophy_mandible",
                  "minimal_atrophy_maxilla",
                  "moderate_atrophy_mandible",
                  "moderate_atrophy_maxilla",
                  "severe_atrophy_mandible",
                  "severe_atrophy_maxilla"
                ].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={formData.clinical_observation?.[condition] || false}
                      onCheckedChange={(checked) => handleInputChange("clinical_observation", {
                        ...formData.clinical_observation,
                        [condition]: checked
                      })}
                    />
                    <Label htmlFor={condition}>
                      {condition.split("_").map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(" ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="evaluation_notes">Evaluation Notes</Label>
              <Textarea
                id="evaluation_notes"
                value={formData.evaluation_notes || ""}
                onChange={(e) => handleInputChange("evaluation_notes", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxillary_sinuses_evaluation">Maxillary Sinuses Evaluation</Label>
              <Textarea
                id="maxillary_sinuses_evaluation"
                value={formData.maxillary_sinuses_evaluation || ""}
                onChange={(e) => handleInputChange("maxillary_sinuses_evaluation", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="airway_evaluation">Airway Evaluation</Label>
              <Textarea
                id="airway_evaluation"
                value={formData.airway_evaluation || ""}
                onChange={(e) => handleInputChange("airway_evaluation", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[400px]">
      {renderStepContent()}
    </div>
  );
};