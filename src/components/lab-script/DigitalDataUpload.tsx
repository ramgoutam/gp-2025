import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";

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
    <div className="space-y-4">
      {section.items.map((item) => {
        const itemId = `${sectionKey}-${item}`;
        const hasFile = !!uploads[itemId]?.file;

        return (
          <div
            key={item}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id={itemId} />
                <Label htmlFor={itemId} className="text-sm font-medium">
                  {item}
                </Label>
              </div>

              <div className="relative">
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, itemId)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".stl,.jpg,.jpeg,.png"
                />
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                    hasFile
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <Upload size={16} />
                  <span className="text-sm font-medium">
                    {hasFile ? "File Selected" : "Upload File"}
                  </span>
                </div>
              </div>
            </div>

            {uploads[itemId]?.file && (
              <div className="mt-2 text-sm text-primary">
                Selected: {uploads[itemId].file.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};