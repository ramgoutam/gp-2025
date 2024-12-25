import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Eye, Download } from "lucide-react";

interface MedicalFormCardProps {
  title: string;
  description: string;
  lastUpdated?: string;
  onDelete?: () => void;
  onAction: () => void;
  onView?: () => void;
  onDownload?: () => void;
  actionLabel: string;
  isDisabled?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  showDownload?: boolean;
}

export const MedicalFormCard = ({
  title,
  description,
  lastUpdated,
  onDelete,
  onAction,
  onView,
  onDownload,
  actionLabel,
  isDisabled = false,
  showDelete = false,
  showView = false,
  showDownload = false,
}: MedicalFormCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">
            {lastUpdated ? `Last updated: ${lastUpdated}` : description}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {showDownload && (
          <Button
            variant="outline"
            onClick={onDownload}
            className="text-sm gap-2 hover:bg-blue-500/10 hover:border-blue-500/30 text-blue-500"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        )}
        <Button 
          variant="outline"
          onClick={onAction}
          className="text-sm gap-2 hover:bg-primary/10 hover:border-primary/30 text-primary"
          disabled={isDisabled}
        >
          <FileText className="w-4 h-4" />
          {actionLabel}
        </Button>
        {showView && (
          <Button
            variant="outline"
            onClick={onView}
            className="text-sm gap-2 hover:bg-blue-500/10 hover:border-blue-500/30 text-blue-500"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
        )}
        {showDelete && (
          <Button
            variant="outline"
            onClick={onDelete}
            className="w-9 h-9 p-0 flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
};