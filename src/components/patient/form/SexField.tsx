import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SexFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const SexField = ({ value, onChange }: SexFieldProps) => {
  return (
    <div className="space-y-2 relative">
      <Label htmlFor="sex">Sex</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select sex" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};