import { LabScript } from "@/types/labScript";

interface ApplianceNumberSectionProps {
  script: LabScript;
}

export const ApplianceNumberSection = ({ script }: ApplianceNumberSectionProps) => {
  if (!script.upperDesignName && !script.lowerDesignName) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-gray-500">Appliance Numbers</h4>
      <div className="grid grid-cols-2 gap-6">
        {script.upperDesignName && (
          <div className="space-y-2">
            <h5 className="font-medium">Upper Appliance Number</h5>
            <p>{script.upperDesignName}</p>
          </div>
        )}
        {script.lowerDesignName && (
          <div className="space-y-2">
            <h5 className="font-medium">Lower Appliance Number</h5>
            <p>{script.lowerDesignName}</p>
          </div>
        )}
      </div>
    </div>
  );
};