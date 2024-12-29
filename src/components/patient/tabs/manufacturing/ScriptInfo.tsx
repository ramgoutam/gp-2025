import React from "react";

interface ScriptInfoProps {
  applianceType: string;
  upperDesignName: string;
  lowerDesignName: string;
  manufacturingSource: string;
  manufacturingType: string;
  material: string;
  shade: string;
  patientFirstName?: string;
  patientLastName?: string;
  designInfo?: {
    appliance_type?: string;  // Made optional
    upper_design_name?: string;  // Made optional
    lower_design_name?: string;  // Made optional
  };
}

export const ScriptInfo = ({
  applianceType,
  upperDesignName,
  lowerDesignName,
  manufacturingSource,
  manufacturingType,
  material,
  shade,
  patientFirstName,
  patientLastName,
  designInfo
}: ScriptInfoProps) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <h3 className="font-semibold text-lg">
        {patientFirstName} {patientLastName} | {designInfo?.appliance_type || applianceType || 'N/A'} | {designInfo?.upper_design_name || upperDesignName || 'No upper appliance'} | {designInfo?.lower_design_name || lowerDesignName || 'No lower appliance'}
      </h3>
    </div>
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