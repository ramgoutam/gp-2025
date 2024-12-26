import { LabScript } from "@/types/labScript";

interface TreatmentInfoProps {
  script: LabScript;
}

export const TreatmentInfo = ({ script }: TreatmentInfoProps) => {
  const treatments = {
    upper: script.upperTreatment && script.upperTreatment !== "None" ? [script.upperTreatment] : [],
    lower: script.lowerTreatment && script.lowerTreatment !== "None" ? [script.lowerTreatment] : []
  };

  return (
    <div className="space-y-1">
      {treatments.upper.length > 0 && (
        <div className="text-sm">
          <span className="font-medium">Upper:</span> {treatments.upper.join(", ")}
        </div>
      )}
      {treatments.lower.length > 0 && (
        <div className="text-sm">
          <span className="font-medium">Lower:</span> {treatments.lower.join(", ")}
        </div>
      )}
    </div>
  );
};