import { format } from "date-fns";
import { LabScript } from "@/types/labScript";

interface ClinicalInformationProps {
  script: LabScript;
}

export const ClinicalInformation = ({ script }: ClinicalInformationProps) => {
  if (!script.clinicalInfo) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Clinical Information</h3>
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Insertion Date</p>
          <p className="font-medium">
            {script.clinicalInfo.insertion_date 
              ? format(new Date(script.clinicalInfo.insertion_date), 'MMM dd, yyyy') 
              : 'Not specified'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Appliance Fit</p>
          <p className="font-medium">{script.clinicalInfo.appliance_fit || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Design Feedback</p>
          <p className="font-medium">{script.clinicalInfo.design_feedback || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Occlusion</p>
          <p className="font-medium">{script.clinicalInfo.occlusion || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Esthetics</p>
          <p className="font-medium">{script.clinicalInfo.esthetics || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Adjustments Made</p>
          <p className="font-medium">{script.clinicalInfo.adjustments_made || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Material</p>
          <p className="font-medium">{script.clinicalInfo.material || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Shade</p>
          <p className="font-medium">{script.clinicalInfo.shade || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
};