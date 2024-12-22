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

interface ApplianceSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApplianceSection = ({ value, onChange }: ApplianceSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="applianceType">Appliance Type</Label>
      <Select value={value} onValueChange={onChange}>
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