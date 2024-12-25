import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChiefComplaintsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const ChiefComplaintsSection = ({ formData, setFormData }: ChiefComplaintsSectionProps) => {
  const complaints = [
    { id: "orofacial_pain", label: "Orofacial Pain" },
    { id: "craniofacial_pain", label: "Craniofacial Pain" },
    { id: "headaches", label: "Headaches (ICD R51)", code: "R51" },
    { id: "migraines", label: "Migraines" },
    { id: "head_pain", label: "Head Pain" },
    { id: "jaw_pain", label: "Jaw Pain (R68.84)", code: "R68.84" },
    { id: "oral_infection", label: "Oral Infection (ICD K04.7)", code: "K04.7" },
  ];

  const symptoms = [
    { id: "swelling_inflammation", label: "Swelling/Inflammation" },
    { id: "limited_diet", label: "Limited Diet/Soft Diet" },
    { id: "difficulty_chewing", label: "Difficulty Chewing" },
    { id: "pain_when_chewing", label: "Pain When Chewing" },
  ];

  const handleComplaintChange = (complaintId: string) => {
    const currentComplaints = formData.chief_complaints || {};
    const currentValue = currentComplaints[complaintId] === "true";
    
    setFormData({
      ...formData,
      chief_complaints: {
        ...currentComplaints,
        [complaintId]: currentValue ? "false" : "true",
      },
    });
  };

  const handleDurationChange = (field: string, value: string) => {
    const currentComplaints = formData.chief_complaints || {};
    setFormData({
      ...formData,
      chief_complaints: {
        ...currentComplaints,
        duration_months: field === 'months' ? value : currentComplaints.duration_months,
        duration_years: field === 'years' ? value : currentComplaints.duration_years,
      },
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
        <Label className="text-lg font-semibold">Chief Complaint: Please select all that apply to patient</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map((complaint) => (
            <SelectionButton
              key={complaint.id}
              selected={formData.chief_complaints?.[complaint.id] === "true"}
              onClick={() => handleComplaintChange(complaint.id)}
            >
              {complaint.label}
            </SelectionButton>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold">Symptoms Present for:</Label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={formData.chief_complaints?.duration_months || ""}
              onChange={(e) => handleDurationChange('months', e.target.value)}
              className="w-20"
            />
            <Label>months</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={formData.chief_complaints?.duration_years || ""}
              onChange={(e) => handleDurationChange('years', e.target.value)}
              className="w-20"
            />
            <Label>years</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold">Associated Symptoms:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {symptoms.map((symptom) => (
            <SelectionButton
              key={symptom.id}
              selected={formData.chief_complaints?.[symptom.id] === "true"}
              onClick={() => handleComplaintChange(symptom.id)}
            >
              {symptom.label}
            </SelectionButton>
          ))}
        </div>
      </div>
    </div>
  );
};