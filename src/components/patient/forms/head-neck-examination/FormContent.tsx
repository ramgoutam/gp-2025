import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          <div className="space-y-4">
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
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  value={formData.vital_signs?.pulse || ""}
                  onChange={(e) => handleInputChange("vital_signs", {
                    ...formData.vital_signs,
                    pulse: e.target.value
                  })}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Medical Conditions</Label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Diabetes",
                  "Hypertension",
                  "Heart Disease",
                  "Respiratory Issues",
                  "Allergies",
                  "Bleeding Disorders",
                ].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={condition}
                      checked={formData.medical_history?.[condition] || false}
                      onChange={(e) => handleInputChange("medical_history", {
                        ...formData.medical_history,
                        [condition]: e.target.checked
                      })}
                    />
                    <Label htmlFor={condition}>{condition}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                value={formData.medical_history?.medications || ""}
                onChange={(e) => handleInputChange("medical_history", {
                  ...formData.medical_history,
                  medications: e.target.value
                })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Extra-oral Examination</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Facial Symmetry</Label>
                  <RadioGroup
                    value={formData.extra_oral_examination?.facial_symmetry || ""}
                    onValueChange={(value) => handleInputChange("extra_oral_examination", {
                      ...formData.extra_oral_examination,
                      facial_symmetry: value
                    })}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="symmetric" id="symmetric" />
                        <Label htmlFor="symmetric">Symmetric</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asymmetric" id="asymmetric" />
                        <Label htmlFor="asymmetric">Asymmetric</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>TMJ Examination</Label>
                  <Select
                    value={formData.extra_oral_examination?.tmj_examination || ""}
                    onValueChange={(value) => handleInputChange("extra_oral_examination", {
                      ...formData.extra_oral_examination,
                      tmj_examination: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select TMJ condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="clicking">Clicking</SelectItem>
                      <SelectItem value="pain">Pain</SelectItem>
                      <SelectItem value="limited_opening">Limited Opening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Intra-oral Examination</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Oral Hygiene</Label>
                  <Select
                    value={formData.intra_oral_examination?.oral_hygiene || ""}
                    onValueChange={(value) => handleInputChange("intra_oral_examination", {
                      ...formData.intra_oral_examination,
                      oral_hygiene: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select oral hygiene status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <Label htmlFor="airway_evaluation">Airway Evaluation</Label>
              <Textarea
                id="airway_evaluation"
                value={formData.airway_evaluation || ""}
                onChange={(e) => handleInputChange("airway_evaluation", e.target.value)}
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