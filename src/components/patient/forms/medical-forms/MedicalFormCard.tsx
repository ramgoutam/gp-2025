import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";

interface MedicalFormCardProps {
  title: string;
  description: string;
  lastUpdated?: string;
  onDelete?: () => void;
  onAction: () => void;
  actionLabel: string;
  isDisabled?: boolean;
  showDelete?: boolean;
}

export const MedicalFormCard = ({
  title,
  description,
  lastUpdated,
  onDelete,
  onAction,
  actionLabel,
  isDisabled = false,
  showDelete = false,
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
        <Button 
          variant={showDelete ? "outline" : "default"}
          onClick={onAction}
          className="text-sm gap-2"
          disabled={isDisabled}
        >
          <FileText className="w-4 h-4" />
          {actionLabel}
        </Button>
        {showDelete && (
          <Button
            variant="outline"
            onClick={onDelete}
            className="text-sm gap-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};