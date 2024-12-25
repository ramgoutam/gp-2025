import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface FormHeaderProps {
  onDownload: () => void;
}

export const FormHeader = ({
  onDownload,
}: FormHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <Button
        type="button"
        variant="outline"
        onClick={onDownload}
        size="sm"
        className="flex items-center gap-1"
      >
        <FileDown className="w-4 h-4" />
        Download
      </Button>
    </div>
  );
};