import React from "react";
import { Button } from "@/components/ui/button";

interface FileListProps {
  fileUploads: Record<string, File[]>;
  onPreview: (file: File) => void;
}

export const FileList = ({ fileUploads, onPreview }: FileListProps) => {
  const isPreviewable = (file: File) => {
    const extension = file.name.toLowerCase();
    return extension.endsWith('.stl') || file.type.startsWith('image/');
  };

  return (
    <>
      {Object.entries(fileUploads).map(([key, files]) => {
        if (!files || files.length === 0) return null;

        return (
          <div key={key} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-500">{key}</h4>
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm">{file.name}</span>
                  {isPreviewable(file) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreview(file)}
                    >
                      Preview
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};