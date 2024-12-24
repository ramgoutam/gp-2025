import React from 'react';
import { LabScript } from "@/types/labScript";

interface ScriptTitleProps {
  script: LabScript;
}

export const ScriptTitle = ({ script }: ScriptTitleProps) => {
  const upperDesign = script.upperDesignName || "Not specified";
  const lowerDesign = script.lowerDesignName || "Not specified";
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold">{script.applianceType || "N/A"}</span>
      <span className="text-sm text-gray-500">|</span>
      <span className="text-sm text-gray-600">Upper: {upperDesign}</span>
      <span className="text-sm text-gray-500">|</span>
      <span className="text-sm text-gray-600">Lower: {lowerDesign}</span>
    </div>
  );
};