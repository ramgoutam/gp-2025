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

const generateDesignNames = (prefix: string, count: number) => {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
};

const getDesignNameOptions = (applianceType: string, isUpper: boolean) => {
  const count = applianceType === "Surgical Day appliance" ? 5 : 20;
  
  const prefixMap = {
    "Surgical Day appliance": isUpper ? "USDA" : "LSDA",
    "Printed Try-in": isUpper ? "UPTI" : "LPTI",
    "Nightguard": isUpper ? "UNG" : "LNG"
  } as const;
  
  const prefix = prefixMap[applianceType as keyof typeof prefixMap];
  return prefix ? generateDesignNames(prefix, count) : [];
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
              <SelectContent>
                {upperOptions.map((name) => (
                  <SelectItem key={name} value={name}>
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
              <SelectContent>
                {lowerOptions.map((name) => (
                  <SelectItem key={name} value={name}>
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