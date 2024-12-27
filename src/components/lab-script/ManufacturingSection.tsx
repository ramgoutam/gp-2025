import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MFG_SOURCES = ["Inhouse", "Outsource"] as const;
const MFG_TYPES = ["Printing", "Milling"] as const;

interface ManufacturingSectionProps {
  manufacturingSource: string;
  manufacturingType: string;
  onManufacturingSourceChange: (value: string) => void;
  onManufacturingTypeChange: (value: string) => void;
}

export const ManufacturingSection = ({
  manufacturingSource,
  manufacturingType,
  onManufacturingSourceChange,
  onManufacturingTypeChange
}: ManufacturingSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Manufacturing Source</h4>
        <Select value={manufacturingSource} onValueChange={onManufacturingSourceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select manufacturing source" />
          </SelectTrigger>
          <SelectContent>
            {MFG_SOURCES.map((source) => (
              <SelectItem key={source} value={source} className="hover:bg-gray-100">
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Manufacturing Type</h4>
        <Select value={manufacturingType} onValueChange={onManufacturingTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select manufacturing type" />
          </SelectTrigger>
          <SelectContent>
            {MFG_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="hover:bg-gray-100">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};