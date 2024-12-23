import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePreviewDialog } from "./FilePreviewDialog";

interface FileListProps {
  fileUploads: Record<string, File[]>;
  onPreview?: (file: File) => void;
}

export const FileList = ({ fileUploads, onPreview }: FileListProps) => {
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const isValidFile = (file: any): file is File => {
    return file instanceof File || (file && typeof file.name === 'string');
  };

  const isPreviewable = (file: File) => {
    if (!isValidFile(file)) {
      console.log("Invalid file object:", file);
      return false;
    }
    const extension = file.name.toLowerCase();
    return extension.endsWith('.stl') || file.type.startsWith('image/');
  };

  const handlePreview = (file: File) => {
    if (!isValidFile(file)) {
      console.log("Attempted to preview invalid file:", file);
      return;
    }

    console.log("Opening preview for file:", file.name);
    
    if (onPreview) {
      onPreview(file);
      return;
    }
    
    if (file.name.toLowerCase().endsWith('.stl')) {
      setPreviewFile(file);
      setImagePreviewUrl(null);
    } else if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
      setPreviewFile(null);
    }
    setShowPreview(true);
  };

  const closePreview = () => {
    console.log("Closing preview");
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    setPreviewFile(null);
    setShowPreview(false);
  };

  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, []);

  return (
    <>
      {Object.entries(fileUploads).map(([key, files]) => {
        if (!files || files.length === 0) return null;

        // Filter out invalid file objects
        const validFiles = files.filter(isValidFile);
        if (validFiles.length === 0) return null;

        return (
          <div key={key} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-500">{key}</h4>
            <div className="flex flex-wrap gap-2">
              {validFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  {isPreviewable(file) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(file)}
                      className="h-7 px-2"
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

      {!onPreview && (
        <FilePreviewDialog
          file={previewFile}
          imageUrl={imagePreviewUrl}
          isOpen={showPreview}
          onClose={closePreview}
        />
      )}
    </>
  );
};