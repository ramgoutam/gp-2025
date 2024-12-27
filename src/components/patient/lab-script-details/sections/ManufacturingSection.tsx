import { LabScript } from "@/types/labScript";

interface ManufacturingSectionProps {
  script: LabScript;
}

export const ManufacturingSection = ({ script }: ManufacturingSectionProps) => {
  if (!script.manufacturingSource && !script.manufacturingType) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-gray-500">Manufacturing Details</h4>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h5 className="font-medium">Manufacturing Source</h5>
          <p>{script.manufacturingSource || "Not specified"}</p>
        </div>
        <div className="space-y-2">
          <h5 className="font-medium">Manufacturing Type</h5>
          <p>{script.manufacturingType || "Not specified"}</p>
        </div>
      </div>
    </div>
  );
};