import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type FileUpload = {
  id: string;
  file: File | null;
};

type DigitalDataSection = {
  items: string[];
};

interface DigitalDataUploadProps {
  section: DigitalDataSection;
  sectionKey: string;
  uploads: Record<string, FileUpload>;
  onFileChange: (itemId: string, file: File | null) => void;
}

export const DigitalDataUpload = ({
  section,
  sectionKey,
  uploads,
  onFileChange,
}: DigitalDataUploadProps) => {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const file = event.target.files?.[0] || null;
    onFileChange(itemId, file);
  };

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {section.items.map((item) => {
          const itemId = `${sectionKey}-${item}`;
          return (
            <div key={item} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id={itemId} />
                <Label htmlFor={itemId}>{item}</Label>
              </div>
              <Input
                type="file"
                onChange={(e) => handleFileChange(e, itemId)}
                className="max-w-md"
                accept=".stl,.jpg,.jpeg,.png"
              />
              {uploads[itemId]?.file && (
                <div className="text-sm text-green-600">
                  File selected: {uploads[itemId].file.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};