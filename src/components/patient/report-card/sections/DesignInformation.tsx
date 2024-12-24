import { format } from "date-fns";
import { LabScript } from "@/types/labScript";

interface DesignInformationProps {
  script: LabScript;
}

export const DesignInformation = ({ script }: DesignInformationProps) => {
  if (!script.designInfo) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Design Information</h3>
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Design Date</p>
          <p className="font-medium">
            {format(new Date(script.designInfo.design_date), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Implant Library</p>
          <p className="font-medium">{script.designInfo.implant_library || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Teeth Library</p>
          <p className="font-medium">{script.designInfo.teeth_library || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Screw</p>
          <p className="font-medium">{script.designInfo.screw || 'Not specified'}</p>
        </div>
        <div className="col-span-2 space-y-2">
          <p className="text-sm text-gray-500">Actions Taken</p>
          <p className="font-medium whitespace-pre-wrap">{script.designInfo.actions_taken || 'None'}</p>
        </div>
      </div>
    </div>
  );
};