import React from "react";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, Pause, PlayCircle } from "lucide-react";

interface ManufacturingActionButtonsProps {
  scriptId: string;
  manufacturingStatus: { [key: string]: string };
  currentManufacturingStatus: string | null;
  manufacturingType: string;
  onStartManufacturing: (scriptId: string) => void;
  onCompleteManufacturing: (scriptId: string) => void;
  onHoldManufacturing: () => void;
  onResumeManufacturing: () => void;
}

export const ManufacturingActionButtons = ({
  scriptId,
  manufacturingStatus,
  currentManufacturingStatus,
  manufacturingType,
  onStartManufacturing,
  onCompleteManufacturing,
  onHoldManufacturing,
  onResumeManufacturing,
}: ManufacturingActionButtonsProps) => {
  const processType = manufacturingType.toLowerCase() === 'milling' ? 'Milling' : 'Printing';

  if (!manufacturingStatus[scriptId] && currentManufacturingStatus !== 'on_hold') {
    return (
      <Button 
        variant="outline"
        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 group"
        onClick={() => onStartManufacturing(scriptId)}
      >
        <Play className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
        Start {processType}
      </Button>
    );
  }

  if (currentManufacturingStatus === 'on_hold') {
    return (
      <Button 
        variant="outline"
        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 group"
        onClick={onResumeManufacturing}
      >
        <PlayCircle className="w-4 h-4 mr-2 group-hover:rotate-[360deg] transition-all duration-500" />
        Resume {processType}
      </Button>
    );
  }

  if (manufacturingStatus[scriptId] === 'in_progress') {
    return (
      <>
        <Button 
          variant="outline"
          className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={() => onCompleteManufacturing(scriptId)}
        >
          <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
          Complete {processType}
        </Button>
        <Button
          variant="outline"
          className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 transform hover:scale-105 transition-all duration-300 group"
          onClick={onHoldManufacturing}
        >
          <Pause className="w-4 h-4 mr-2 group-hover:scale-110 transition-all duration-300" />
          Hold
        </Button>
      </>
    );
  }

  return null;
};