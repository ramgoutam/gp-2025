import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MANUFACTURING_SOURCES = ["Inhouse", "Outsource"] as const;
const MANUFACTURING_TYPES = ["Printing", "Milling"] as const;
const MATERIALS = [
  "Zirconia",
  "PMMA",
  "Titanium",
  "Ceramic",
  "Composite",
  "Acrylic"
] as const;
const SHADES = [
  "A1", "A2", "A3", "A3.5", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2", "C3", "C4",
  "D2", "D3", "D4"
] as const;

interface ManufacturingSectionProps {
  manufacturingSource: string;
  manufacturingType: string;
  material: string;
  shade: string;
  onManufacturingSourceChange: (value: string) => void;
  onManufacturingTypeChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
  onShadeChange: (value: string) => void;
  isEditable?: boolean;
}

export const ManufacturingSection = ({
  manufacturingSource,
  manufacturingType,
  material,
  shade,
  onManufacturingSourceChange,
  onManufacturingTypeChange,
  onMaterialChange,
  onShadeChange,
  isEditable = true
}: ManufacturingSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Manufacturing Details</h3>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="manufacturingSource">Manufacturing Source</Label>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturingType">Manufacturing Type</Label>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Select value={material} onValueChange={onMaterialChange}>
            <SelectTrigger id="material">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[200]">
              {MATERIALS.map((material) => (
                <SelectItem 
                  key={material} 
                  value={material}
                  className="hover:bg-gray-100"
                >
                  {material}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shade">Shade</Label>
          <Select value={shade} onValueChange={onShadeChange}>
            <SelectTrigger id="shade">
              <SelectValue placeholder="Select shade" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[200]">
              {SHADES.map((shade) => (
                <SelectItem 
                  key={shade} 
                  value={shade}
                  className="hover:bg-gray-100"
                >
                  {shade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};