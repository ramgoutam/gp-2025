import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const APPLIANCE_TYPES = [
  "Surgical Day appliance",
  "Printed Try-in",
  "Nightguard",
  "Direct load PMMA",
  "Direct Load Zirconia",
  "Ti-Bar and Superstructure"
] as const;

const DEFAULT_MANUFACTURING_APPLIANCES = [
  "Surgical Day appliance",
  "Printed Try-in",
  "Nightguard"
];

interface ApplianceSectionProps {
  value: string;
  onChange: (value: string) => void;
  onManufacturingChange?: (source: string, type: string) => void;
}

export const ApplianceSection = ({ 
  value, 
  onChange,
  onManufacturingChange 
}: ApplianceSectionProps) => {
  const handleApplianceChange = (newValue: string) => {
    onChange(newValue);
    
    // Set default manufacturing values for specific appliance types
    if (DEFAULT_MANUFACTURING_APPLIANCES.includes(newValue)) {
      console.log("Setting default manufacturing values for:", newValue);
      onManufacturingChange?.("Inhouse", "Printing");
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="applianceType">Appliance Type</Label>
      <Select value={value} onValueChange={handleApplianceChange}>
        <SelectTrigger id="applianceType">
          <SelectValue placeholder="Select appliance type" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {APPLIANCE_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};