import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { STLViewer } from "./STLViewer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewDialogProps {
  file: File | null;
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FilePreviewDialog = ({ file, imageUrl, isOpen, onClose }: FilePreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] h-[90vh] p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Preview - {file?.name || imageUrl?.split('/').pop()}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {file?.type || (imageUrl ? 'Image file' : '')}
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex-1 h-full p-4 overflow-hidden">
          {file?.name?.toLowerCase().endsWith('.stl') && file && (
            <div className="h-full w-full">
              <STLViewer file={file} />
            </div>
          )}
          {imageUrl && (
            <div className="h-full w-full flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};