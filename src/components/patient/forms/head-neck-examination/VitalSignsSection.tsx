import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VitalSignsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const VitalSignsSection = ({ formData, setFormData }: VitalSignsSectionProps) => {
  const updateVitalSigns = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      vital_signs: {
        ...prev.vital_signs,
        [key]: value
      }
    }));
  };

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    const height = parseFloat(formData.vital_signs?.height || "0");
    const weight = parseFloat(formData.vital_signs?.weight || "0");
    
    if (height > 0 && weight > 0) {
      // Convert height from cm to meters for BMI calculation
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      updateVitalSigns("bmi", bmi.toFixed(1));
    }
  }, [formData.vital_signs?.height, formData.vital_signs?.weight]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Vital Signs</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.vital_signs?.height || ""}
            onChange={(e) => updateVitalSigns("height", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.vital_signs?.weight || ""}
            onChange={(e) => updateVitalSigns("weight", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bmi">BMI</Label>
          <Input
            id="bmi"
            type="text"
            value={formData.vital_signs?.bmi || ""}
            readOnly
            className="bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hp">HP</Label>
          <Input
            id="hp"
            type="text"
            value={formData.vital_signs?.hp || ""}
            onChange={(e) => updateVitalSigns("hp", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blood_pressure">Blood Pressure</Label>
          <Input
            id="blood_pressure"
            value={formData.vital_signs?.blood_pressure || ""}
            onChange={(e) => updateVitalSigns("blood_pressure", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            value={formData.vital_signs?.temperature || ""}
            onChange={(e) => updateVitalSigns("temperature", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};