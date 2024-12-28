import React from "react";

interface ScriptInfoProps {
  applianceType: string;
  upperDesignName: string;
  lowerDesignName: string;
  manufacturingSource: string;
  manufacturingType: string;
  material: string;
  shade: string;
}

export const ScriptInfo = ({
  applianceType,
  upperDesignName,
  lowerDesignName,
  manufacturingSource,
  manufacturingType,
  material,
  shade,
}: ScriptInfoProps) => (
  <div>
    <h3 className="font-semibold text-lg">
      {applianceType || 'N/A'} | {upperDesignName || 'No upper appliance'} | {lowerDesignName || 'No lower appliance'}
    </h3>
    <div className="grid grid-cols-2 gap-3 text-sm mt-3">
      <div>
        <p className="text-gray-500 text-xs">Manufacturing Source</p>
        <p className="font-medium">{manufacturingSource}</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs">Manufacturing Type</p>
        <p className="font-medium">{manufacturingType}</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs">Material</p>
        <p className="font-medium">{material || 'N/A'}</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs">Shade</p>
        <p className="font-medium">{shade || 'N/A'}</p>
      </div>
    </div>
  </div>
);