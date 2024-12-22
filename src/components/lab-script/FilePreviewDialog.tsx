import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent className="sm:max-w-[800px] h-[600px]">
        <DialogHeader>
          <DialogTitle>
            Preview - {file?.name || imageUrl?.split('/').pop()}
          </DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 h-full">
          {file && <STLViewer file={file} />}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};