import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShadeSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ShadeSection = ({ value, onChange }: ShadeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="shade">Shade</Label>
      <Input
        id="shade"
        name="shade"
        value={value}
        onChange={onChange}
        placeholder="Enter shade"
      />
    </div>
  );
};