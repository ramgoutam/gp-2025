import React from "react";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, Search, ThumbsDown, ThumbsUp } from "lucide-react";

interface ManufacturingStepsProps {
  scriptId: string;
  manufacturingStatus: { [key: string]: string };
  sinteringStatus: { [key: string]: string };
  miyoStatus: { [key: string]: string };
  inspectionStatus: { [key: string]: string };
  onStartManufacturing: (scriptId: string) => void;
  onCompleteManufacturing: (scriptId: string) => void;
  onStartSintering: (scriptId: string) => void;
  onCompleteSintering: (scriptId: string) => void;
  onStartMiyo: (scriptId: string) => void;
  onCompleteMiyo: (scriptId: string) => void;
  onStartInspection: (scriptId: string) => void;
  onRejectInspection: (scriptId: string) => void;
  onApproveInspection: (scriptId: string) => void;
  manufacturingType?: string;
}

export const ManufacturingSteps = ({
  scriptId,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus,
  onStartManufacturing,
  onCompleteManufacturing,
  onStartSintering,
  onCompleteSintering,
  onStartMiyo,
  onCompleteMiyo,
  onStartInspection,
  onRejectInspection,
  onApproveInspection,
  manufacturingType = 'Milling',
}: ManufacturingStepsProps) => {
  return (
    <div className="flex gap-2">
      {!manufacturingStatus[scriptId] && (
        <Button 
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onStartManufacturing(scriptId)}
        >
          <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
          Start {manufacturingType}
        </Button>
      )}
      {manufacturingStatus[scriptId] === 'in_progress' && (
        <Button 
          variant="outline"
          className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onCompleteMiyo(scriptId)}
        >
          <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
          Complete {manufacturingType}
        </Button>
      )}

      {manufacturingStatus[scriptId] === 'completed' && !sinteringStatus[scriptId] && (
        <Button 
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onStartSintering(scriptId)}
        >
          <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
          Start Sintering
        </Button>
      )}
      {sinteringStatus[scriptId] === 'in_progress' && (
        <Button 
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onCompleteSintering(scriptId)}
        >
          <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
          Complete Sintering
        </Button>
      )}
      {sinteringStatus[scriptId] === 'completed' && !miyoStatus[scriptId] && (
        <Button 
          variant="outline"
          className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onStartMiyo(scriptId)}
        >
          <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
          Start Miyo
        </Button>
      )}
      {miyoStatus[scriptId] === 'in_progress' && (
        <Button 
          variant="outline"
          className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onCompleteMiyo(scriptId)}
        >
          <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
          Complete Miyo
        </Button>
      )}
      {miyoStatus[scriptId] === 'completed' && !inspectionStatus[scriptId] && (
        <Button 
          variant="outline"
          className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onStartInspection(scriptId)}
        >
          <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
          Start Inspection
        </Button>
      )}
      {inspectionStatus[scriptId] === 'in_progress' && (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={() => onRejectInspection(scriptId)}
          >
            <ThumbsDown className="w-4 h-4 mr-2 group-hover:rotate-12 transition-all duration-300" />
            Rejected
          </Button>
          <Button 
            variant="outline"
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transform hover:scale-105 transition-all duration-300 group"
            onClick={() => onApproveInspection(scriptId)}
          >
            <ThumbsUp className="w-4 h-4 mr-2 group-hover:rotate-12 transition-all duration-300" />
            Approved
          </Button>
        </div>
      )}
      {inspectionStatus[scriptId] === 'approved' && (
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 animate-fade-in">
          Ready to Insert
        </div>
      )}
      {inspectionStatus[scriptId] === 'rejected' && (
        <div className="px-4 py-2 bg-red-50 text-red-700 rounded-md border border-red-200 animate-fade-in">
          Inspection Failed
        </div>
      )}
    </div>
  );
};