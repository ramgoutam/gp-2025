import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MedicalHistorySectionProps {
  formData: any;
  updateMedicalHistory: (key: string, value: any) => void;
}

export const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  formData,
  updateMedicalHistory,
}) => {
  const medicalConditions = [
    'diabetes',
    'hypertension',
    'heart_disease',
    'respiratory_issues',
    'allergies',
    'medications',
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Medical Conditions</h3>
        <div className="grid grid-cols-2 gap-4">
          {medicalConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={formData.medical_history?.[condition] || false}
                onCheckedChange={(checked) => updateMedicalHistory(condition, checked)}
              />
              <Label htmlFor={condition} className="capitalize">
                {condition.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};