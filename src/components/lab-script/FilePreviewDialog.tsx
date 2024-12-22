import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { STLViewer } from "./STLViewer";

interface FilePreviewDialogProps {
  file: File | null;
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewDialog = ({ file, imageUrl, isOpen, onClose }: FilePreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0 gap-0">
        <div className="p-4 pb-0">
          <DialogTitle className="text-xl">
            Preview - {file?.name || imageUrl?.split('/').pop()}
          </DialogTitle>
          <DialogDescription>
            {file?.type || (imageUrl ? 'Image file' : '')}
          </DialogDescription>
        </div>
        <div className="relative flex-1 p-4 overflow-hidden">
          {file?.name?.toLowerCase().endsWith('.stl') && file && (
            <div className="h-[500px] w-full">
              <STLViewer file={file} />
            </div>
          )}
          {imageUrl && (
            <div className="flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-[500px] object-contain"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};