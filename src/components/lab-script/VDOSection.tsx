import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VDO_OPTIONS = [
  "Open upto 4 mm without calling Doctor",
  "Open upto 4 mm with calling Doctor",
  "Open VDO based on requirement",
  "No changes required in VDO"
] as const;

interface VDOSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const VDOSection = ({ value, onChange }: VDOSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">VDO Details</h4>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select VDO option" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {VDO_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};