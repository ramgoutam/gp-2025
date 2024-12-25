import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
    const currentValue = formData.medical_history?.conditions?.[condition] === "true";
    updateMedicalHistory("conditions", {
      ...(formData.medical_history?.conditions || {}),
      [condition]: currentValue ? "false" : "true"
    });
  };

  const toggleAllergy = (allergy: string) => {
    const currentValue = formData.medical_history?.allergies?.[allergy] === "true";
    updateMedicalHistory("allergies", {
      ...(formData.medical_history?.allergies || {}),
      [allergy]: currentValue ? "false" : "true"
    });
  };

  const SelectionButton = ({ 
    selected, 
    onClick, 
    children 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    children: React.ReactNode 
  }) => (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      onClick={onClick}
      className="h-auto py-2 px-4 text-sm font-medium transition-all w-full justify-start"
    >
      {children}
    </Button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medical History</h3>
        <div className="grid grid-cols-2 gap-4">
          {medicalConditions.map((condition) => (
            <SelectionButton
              key={condition}
              selected={formData.medical_history?.conditions?.[condition] === "true"}
              onClick={() => toggleCondition(condition)}
            >
              {condition}
            </SelectionButton>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Allergies</h3>
        <div className="grid grid-cols-2 gap-4">
          {allergyTypes.map((allergy) => (
            <SelectionButton
              key={allergy}
              selected={formData.medical_history?.allergies?.[allergy] === "true"}
              onClick={() => toggleAllergy(allergy)}
            >
              {allergy}
            </SelectionButton>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">COVID-19 Vaccination Status</h3>
        <RadioGroup
          value={formData.medical_history?.covid19_vaccinated || ""}
          onValueChange={(value) => updateMedicalHistory("covid19_vaccinated", value)}
          className="flex items-center space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="covid-yes" />
            <Label htmlFor="covid-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="covid-no" />
            <Label htmlFor="covid-no">No</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};