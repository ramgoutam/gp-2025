import { LabScript } from "@/types/labScript";

interface TreatmentInformationProps {
  script: LabScript;
}

export const TreatmentInformation = ({ script }: TreatmentInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Treatment Information</h3>
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Upper Treatment</p>
          <p className="font-medium">{script.upperTreatment || 'None'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Lower Treatment</p>
          <p className="font-medium">{script.lowerTreatment || 'None'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Upper Design Name</p>
          <p className="font-medium">{script.upperDesignName || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Lower Design Name</p>
          <p className="font-medium">{script.lowerDesignName || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Appliance Type</p>
          <p className="font-medium">{script.applianceType || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Screw Type</p>
          <p className="font-medium">{script.screwType || 'Not specified'}</p>
        </div>
        {script.vdoOption && (
          <div className="space-y-2 col-span-2">
            <p className="text-sm text-gray-500">VDO Option</p>
            <p className="font-medium">{script.vdoOption}</p>
          </div>
        )}
      </div>
    </div>
  );
};