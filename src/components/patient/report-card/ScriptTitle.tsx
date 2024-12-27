import React from 'react';
import { LabScript } from "@/types/labScript";

interface ScriptTitleProps {
  script: LabScript;
  patientName?: string;
}

export const ScriptTitle = ({ script, patientName }: ScriptTitleProps) => {
  const upperDesign = script.upperDesignName || "Not specified";
  const lowerDesign = script.lowerDesignName || "Not specified";
  
  return (
    <div className="flex items-center gap-2 text-sm">
      {patientName && (
        <>
          <span className="font-medium text-gray-900">{patientName}</span>
          <span className="text-gray-400">|</span>
        </>
      )}
      <span className="font-medium text-gray-900">{script.applianceType || "N/A"}</span>
      <span className="text-gray-400">|</span>
      <span className="text-gray-600">Upper: {upperDesign}</span>
      <span className="text-gray-400">|</span>
      <span className="text-gray-600">Lower: {lowerDesign}</span>
    </div>
  );
};