import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DesignNameSectionProps {
  applianceType: string;
  upperTreatment: string;
  lowerTreatment: string;
  onUpperDesignNameChange: (value: string) => void;
  onLowerDesignNameChange: (value: string) => void;
  upperDesignName: string;
  lowerDesignName: string;
}

type DesignConfig = {
  count: number;
} & (
  | { prefix: string; useCustomNames?: never }
  | { useCustomNames: true; prefix?: never }
);

const generateDesignNames = (prefix: string, count: number) => {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
};

const generateTiBarNames = (count: number, isUpper: boolean) => {
  return Array.from({ length: count }, (_, i) => {
    const num = i + 1;
    return isUpper ? `USS${num} and UTi-Bar${num}` : `LSS${num} and LTi-Bar${num}`;
  });
};

const getDesignNameOptions = (applianceType: string, isUpper: boolean) => {
  const prefixMap: Record<string, DesignConfig> = {
    "Surgical Day appliance": {
      count: 5,
      prefix: isUpper ? "USDA" : "LSDA"
    },
    "Printed Try-in": {
      count: 20,
      prefix: isUpper ? "UPTI" : "LPTI"
    },
    "Nightguard": {
      count: 20,
      prefix: isUpper ? "UNG" : "LNG"
    },
    "Direct load PMMA": {
      count: 5,
      prefix: isUpper ? "UDLZ" : "LDLZ"
    },
    "Direct Load Zirconia": {
      count: 5,
      prefix: isUpper ? "UDLZ" : "LDLZ"
    },
    "Ti-Bar and Superstructure": {
      count: 5,
      useCustomNames: true
    }
  };
  
  const config = prefixMap[applianceType];
  
  if (!config) return [];
  
  if ('useCustomNames' in config && config.useCustomNames) {
    return generateTiBarNames(config.count, isUpper);
  }
  
  return generateDesignNames(config.prefix!, config.count);
};

export const DesignNameSection = ({
  applianceType,
  upperTreatment,
  lowerTreatment,
  onUpperDesignNameChange,
  onLowerDesignNameChange,
  upperDesignName,
  lowerDesignName
}: DesignNameSectionProps) => {
  const upperOptions = getDesignNameOptions(applianceType, true);
  const lowerOptions = getDesignNameOptions(applianceType, false);

  console.log("Rendering DesignNameSection with:", {
    applianceType,
    upperTreatment,
    lowerTreatment,
    upperOptions,
    lowerOptions
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Design Names</h3>
      <div className="grid grid-cols-2 gap-8">
        {upperTreatment !== "None" && upperOptions.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="upperDesignName">Upper Design Name</Label>
            <Select value={upperDesignName} onValueChange={onUpperDesignNameChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select upper design name" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[200]">
                {upperOptions.map((name) => (
                  <SelectItem key={name} value={name} className="hover:bg-gray-100">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {lowerTreatment !== "None" && lowerOptions.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="lowerDesignName">Lower Design Name</Label>
            <Select value={lowerDesignName} onValueChange={onLowerDesignNameChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select lower design name" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[200]">
                {lowerOptions.map((name) => (
                  <SelectItem key={name} value={name} className="hover:bg-gray-100">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};