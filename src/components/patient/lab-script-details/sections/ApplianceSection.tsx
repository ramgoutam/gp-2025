import { LabScript } from "@/types/labScript";

interface ApplianceSectionProps {
  script: LabScript;
}

export const ApplianceSection = ({ script }: ApplianceSectionProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-gray-500">Appliance Details</h4>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h5 className="font-medium">Appliance Type</h5>
          <p>{script.appliance_type || "N/A"}</p>
        </div>
        <div className="space-y-2">
          <h5 className="font-medium">Shade</h5>
          <p>{script.shade || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};