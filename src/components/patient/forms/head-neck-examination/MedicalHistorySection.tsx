import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface MedicalHistorySectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const MedicalHistorySection = ({
  formData,
  setFormData,
}: MedicalHistorySectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Medical History</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Input
            id="allergies"
            value={formData.medical_history?.allergies || ""}
            onChange={(e) => setFormData((prev: any) => ({
              ...prev,
              medical_history: {
                ...prev.medical_history,
                allergies: e.target.value,
              },
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medications">Current Medications</Label>
          <Input
            id="medications"
            value={formData.medical_history?.medications || ""}
            onChange={(e) => setFormData((prev: any) => ({
              ...prev,
              medical_history: {
                ...prev.medical_history,
                medications: e.target.value,
              },
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medical_conditions">Medical Conditions</Label>
          <Input
            id="medical_conditions"
            value={formData.medical_history?.conditions || ""}
            onChange={(e) => setFormData((prev: any) => ({
              ...prev,
              medical_history: {
                ...prev.medical_history,
                conditions: e.target.value,
              },
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Do you have any of the following conditions?</Label>
          <RadioGroup
            value={formData.medical_history?.has_conditions || ""}
            onValueChange={(value) => setFormData((prev: any) => ({
              ...prev,
              medical_history: {
                ...prev.medical_history,
                has_conditions: value,
              },
            }))}
          >
            <div className="flex gap-4">
              <div className="flex items-center">
                <RadioGroupItem value="yes" id="has_conditions_yes" />
                <Label htmlFor="has_conditions_yes" className="ml-2">Yes</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="no" id="has_conditions_no" />
                <Label htmlFor="has_conditions_no" className="ml-2">No</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
