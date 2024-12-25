import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface IntraOralSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const IntraOralSection = ({ formData, setFormData }: IntraOralSectionProps) => {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      intra_oral_examination: {
        ...prev.intra_oral_examination,
        [field]: value
      }
    }));
  };

  const dentalStatus = [
    { label: "Fully Dentate", value: "fully_dentate" },
    { label: "Partially Edentulous", value: "partially_edentulous" },
    { label: "Completely Edentulous", value: "completely_edentulous" }
  ];

  const dentures = [
    { label: "Upper Partial Denture", value: "upper_partial" },
    { label: "Lower Partial Denture", value: "lower_partial" },
    { label: "Upper Complete Denture", value: "upper_complete" },
    { label: "Lower Complete Denture", value: "lower_complete" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label>Patient Oral Status</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {dentalStatus.map((status) => (
            <div key={status.value} className="flex items-center space-x-2">
              <Checkbox
                id={status.value}
                checked={formData.intra_oral_examination?.[status.value] || false}
                onCheckedChange={(checked) => handleChange(status.value, checked)}
              />
              <Label htmlFor={status.value}>{status.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Dentures</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {dentures.map((denture) => (
            <div key={denture.value} className="flex items-center space-x-2">
              <Checkbox
                id={denture.value}
                checked={formData.intra_oral_examination?.[denture.value] || false}
                onCheckedChange={(checked) => handleChange(denture.value, checked)}
              />
              <Label htmlFor={denture.value}>{denture.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};