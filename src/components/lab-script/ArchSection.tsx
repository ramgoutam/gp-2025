import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ARCH_TYPES = ["Upper", "Lower", "Dual"] as const;

interface ArchSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const ArchSection = ({ value, onChange }: ArchSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="archType">Arch Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="archType">
          <SelectValue placeholder="Select arch type" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {ARCH_TYPES.map((type) => (
            <SelectItem key={type} value={type.toLowerCase()}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};