import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Extend HTMLInputElement to include directory attributes
declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

export const DigitalDataUpload = ({
  section,
  sectionKey,
  uploads,
  onFileChange,
}: DigitalDataUploadProps) => {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const files = event.target.files;
    if (!files) return;

    // For now, we'll just use the first file since the current data structure
    // only supports one file. In a real app, you'd want to modify the data structure
    // to handle multiple files
    const file = files[0] || null;
    onFileChange(itemId, file);
    
    if (files.length > 0) {
      setCheckedItems(prev => ({ ...prev, [itemId]: true }));
      console.log(`Uploaded ${files.length} files for ${itemId}`);
    } else {
      setCheckedItems(prev => ({ ...prev, [itemId]: false }));
    }
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
                <Checkbox 
                  id={itemId} 
                  checked={checkedItems[itemId] || false}
                  onCheckedChange={(checked) => {
                    setCheckedItems(prev => ({ ...prev, [itemId]: checked as boolean }));
                  }}
                />
                <Label htmlFor={itemId} className="text-sm font-medium">
                  {item}
                </Label>
              </div>

              <div className="flex gap-2">
                {/* File Upload Button */}
                <div className="relative">
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, itemId)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".stl,.jpg,.jpeg,.png"
                    multiple
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
                      {hasFile ? "Files Selected" : "Upload Files"}
                    </span>
                  </div>
                </div>

                {/* Folder Upload Button */}
                <div className="relative">
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, itemId)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    webkitdirectory=""
                    directory=""
                  />
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                      hasFile
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <Folder size={16} />
                    <span className="text-sm font-medium">
                      Upload Folder
                    </span>
                  </div>
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