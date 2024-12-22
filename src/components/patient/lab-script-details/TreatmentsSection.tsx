import { LabScript } from "@/components/patient/LabScriptsTab";
import { getTreatments } from "@/utils/treatmentUtils";

interface TreatmentsSectionProps {
  script: LabScript;
}

export const TreatmentsSection = ({ script }: TreatmentsSectionProps) => {
  const treatments = getTreatments(script);
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-gray-500">Treatments</h4>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h5 className="font-medium">Upper</h5>
          <p>{treatments.upper.join(", ") || "None"}</p>
        </div>
        <div className="space-y-2">
          <h5 className="font-medium">Lower</h5>
          <p>{treatments.lower.join(", ") || "None"}</p>
        </div>
      </div>
    </div>
  );
};