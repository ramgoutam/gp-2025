import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface TreatmentSectionProps {
  title: "Upper" | "Lower";
  selectedTeeth: number[];
  onTeethChange: (teeth: number[]) => void;
  treatments: {
    fullArchFixed: boolean;
    denture: boolean;
    crown: boolean;
    nightguard: boolean;
  };
  onTreatmentChange: (key: string, checked: boolean) => void;
}

export const TreatmentSection = ({
  title,
  treatments,
  onTreatmentChange,
}: TreatmentSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${title.toLowerCase()}FullArchFixed`}
            checked={treatments.fullArchFixed}
            onCheckedChange={(checked) =>
              onTreatmentChange("fullArchFixed", checked as boolean)
            }
          />
          <label htmlFor={`${title.toLowerCase()}FullArchFixed`}>Full Arch Fixed</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${title.toLowerCase()}Denture`}
            checked={treatments.denture}
            onCheckedChange={(checked) =>
              onTreatmentChange("denture", checked as boolean)
            }
          />
          <label htmlFor={`${title.toLowerCase()}Denture`}>Denture</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${title.toLowerCase()}Crown`}
            checked={treatments.crown}
            onCheckedChange={(checked) =>
              onTreatmentChange("crown", checked as boolean)
            }
          />
          <label htmlFor={`${title.toLowerCase()}Crown`}>Crown</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${title.toLowerCase()}Nightguard`}
            checked={treatments.nightguard}
            onCheckedChange={(checked) =>
              onTreatmentChange("nightguard", checked as boolean)
            }
          />
          <label htmlFor={`${title.toLowerCase()}Nightguard`}>Nightguard</label>
        </div>
      </div>
    </div>
  );
};