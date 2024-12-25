import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";

interface FormHeaderProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrevious: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onSubmit: (e: React.FormEvent) => void;  // Updated this line
  onDownload: () => void;
}

export const FormHeader = ({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
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

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          size="sm"
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep === totalSteps - 1 ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="flex items-center gap-1"
            onClick={onSubmit}  // This now accepts the event parameter
          >
            {isSubmitting ? "Saving..." : "Save Examination"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            size="sm"
            className="flex items-center gap-1"
          >
            {isSubmitting ? "Saving..." : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};