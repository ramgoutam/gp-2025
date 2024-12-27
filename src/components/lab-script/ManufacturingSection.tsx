import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MANUFACTURING_SOURCES = ["Inhouse", "Outsource"] as const;
const MANUFACTURING_TYPES = ["Printing", "Milling"] as const;

interface ManufacturingSectionProps {
  manufacturingSource: string;
  manufacturingType: string;
  onManufacturingSourceChange: (value: string) => void;
  onManufacturingTypeChange: (value: string) => void;
  isEditable?: boolean;
}

export const ManufacturingSection = ({
  manufacturingSource,
  manufacturingType,
  onManufacturingSourceChange,
  onManufacturingTypeChange,
  isEditable = true
}: ManufacturingSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Manufacturing Details</h3>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="manufacturingSource">Manufacturing Source</Label>
          {isEditable ? (
            <Select value={manufacturingSource} onValueChange={onManufacturingSourceChange}>
              <SelectTrigger id="manufacturingSource">
                <SelectValue placeholder="Select manufacturing source" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[200]">
                {MANUFACTURING_SOURCES.map((source) => (
                  <SelectItem 
                    key={source} 
                    value={source}
                    className="hover:bg-gray-100"
                  >
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="px-3 py-2 border rounded-md bg-gray-50">
              {manufacturingSource || "Inhouse"}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturingType">Manufacturing Type</Label>
          {isEditable ? (
            <Select value={manufacturingType} onValueChange={onManufacturingTypeChange}>
              <SelectTrigger id="manufacturingType">
                <SelectValue placeholder="Select manufacturing type" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[200]">
                {MANUFACTURING_TYPES.map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="hover:bg-gray-100"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="px-3 py-2 border rounded-md bg-gray-50">
              {manufacturingType || "Printing"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};