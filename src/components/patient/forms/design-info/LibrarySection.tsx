import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const IMPLANT_LIBRARIES = ["Nobel Biocare", "Straumann", "Zimmer Biomet", "Dentsply Sirona"];
const TEETH_LIBRARIES = ["Premium", "Standard", "Economy"];

interface LibrarySectionProps {
  implantLibrary: string;
  teethLibrary: string;
  onImplantLibraryChange: (value: string) => void;
  onTeethLibraryChange: (value: string) => void;
}

export const LibrarySection = ({
  implantLibrary,
  teethLibrary,
  onImplantLibraryChange,
  onTeethLibraryChange
}: LibrarySectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="implantLibrary">Implant Library</Label>
        <Select value={implantLibrary} onValueChange={onImplantLibraryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select implant library" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[200]">
            {IMPLANT_LIBRARIES.map((lib) => (
              <SelectItem key={lib} value={lib} className="hover:bg-gray-100">
                {lib}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teethLibrary">Teeth Library</Label>
        <Select value={teethLibrary} onValueChange={onTeethLibraryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select teeth library" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[200]">
            {TEETH_LIBRARIES.map((lib) => (
              <SelectItem key={lib} value={lib} className="hover:bg-gray-100">
                {lib}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};