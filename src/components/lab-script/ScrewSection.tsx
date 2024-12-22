import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SCREW_TYPES = ["Rosen", "Dess", "SIN", "DC Screw", "Others"] as const;

interface ScrewSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const ScrewSection = ({ value, onChange }: ScrewSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Screw</h4>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select screw type" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {SCREW_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};