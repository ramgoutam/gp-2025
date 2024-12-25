import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MedicalHistorySectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

const medicalConditions = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Thyroid Disorder",
  "Arthritis",
  "Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Neurological Disorder"
];

const allergyTypes = [
  "Penicillin",
  "Sulfa Drugs",
  "Aspirin",
  "Latex",
  "Local Anesthetics",
  "Iodine",
  "Metals",
  "Food Allergies",
  "Seasonal Allergies",
  "Other"
];

export const MedicalHistorySection = ({ formData, setFormData }: MedicalHistorySectionProps) => {
  const updateMedicalHistory = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      medical_history: {
        ...prev.medical_history,
        [key]: value
      }
    }));
  };

  const toggleCondition = (condition: string) => {
    const currentConditions = formData.medical_history?.conditions || [];
    const updatedConditions = currentConditions.includes(condition)
      ? currentConditions.filter((c: string) => c !== condition)
      : [...currentConditions, condition];
    
    updateMedicalHistory("conditions", updatedConditions);
  };

  const toggleAllergy = (allergy: string) => {
    const currentAllergies = formData.medical_history?.allergies || [];
    const updatedAllergies = currentAllergies.includes(allergy)
      ? currentAllergies.filter((a: string) => a !== allergy)
      : [...currentAllergies, allergy];
    
    updateMedicalHistory("allergies", updatedAllergies);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medical History</h3>
        <div className="grid grid-cols-2 gap-4">
          {medicalConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={(formData.medical_history?.conditions || []).includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <Label htmlFor={condition}>{condition}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Allergies</h3>
        <div className="grid grid-cols-2 gap-4">
          {allergyTypes.map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={allergy}
                checked={(formData.medical_history?.allergies || []).includes(allergy)}
                onCheckedChange={() => toggleAllergy(allergy)}
              />
              <Label htmlFor={allergy}>{allergy}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">COVID-19 Vaccination Status</h3>
        <RadioGroup
          value={formData.medical_history?.covid19_vaccinated || ""}
          onValueChange={(value) => updateMedicalHistory("covid19_vaccinated", value)}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="covid-yes" />
              <Label htmlFor="covid-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="covid-no" />
              <Label htmlFor="covid-no">No</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};