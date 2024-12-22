import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STLViewer } from "./STLViewer";

type FileUpload = {
  id: string;
  files: File[];
};

type DigitalDataSection = {
  items: string[];
};

interface DigitalDataUploadProps {
  section: DigitalDataSection;
  sectionKey: string;
  uploads: Record<string, FileUpload>;
  onFileChange: (itemId: string, files: File[]) => void;
}

export const DigitalDataUpload = ({
  section,
  sectionKey,
  uploads,
  onFileChange,
}: DigitalDataUploadProps) => {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
  const [previewFile, setPreviewFile] = React.useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const filesArray = Array.from(fileList);
    onFileChange(itemId, filesArray);
    
    if (filesArray.length > 0) {
      setCheckedItems(prev => ({ ...prev, [itemId]: true }));
      console.log(`Uploaded ${filesArray.length} files for ${itemId}`);
    } else {
      setCheckedItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handlePreview = (file: File) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-4">
      {section.items.map((item) => {
        const itemId = `${sectionKey}-${item}`;
        const uploadedFiles = uploads[itemId]?.files || [];
        const hasFiles = uploadedFiles.length > 0;

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
                      hasFiles
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <Upload size={16} />
                    <span className="text-sm font-medium">
                      {hasFiles ? `${uploadedFiles.length}/6 files` : "Upload Files"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {hasFiles && (
              <div className="mt-2">
                <div className="text-sm text-primary mb-2">
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="text-sm">
                      {file.name}
                      {file.name.toLowerCase().endsWith('.stl') && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => handlePreview(file)}
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>STL Preview</DialogTitle>
          </DialogHeader>
          {previewFile && <STLViewer file={previewFile} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};