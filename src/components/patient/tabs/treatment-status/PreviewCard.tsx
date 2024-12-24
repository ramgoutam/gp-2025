import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PreviewCardProps {
  icon: LucideIcon;
  title: string;
  value?: string;
  className?: string;
  showEdit?: boolean;
  onEdit?: () => void;
}

export const PreviewCard = ({ 
  icon: Icon, 
  title, 
  value, 
  className = "",
  showEdit = false,
  onEdit,
}: PreviewCardProps) => (
  <Card className={`p-4 hover:shadow-lg transition-all duration-300 group relative ${className}`}>
    <div className="flex items-start space-x-4">
      <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1 flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="font-semibold text-gray-900">
          {value || "Not specified"}
        </p>
      </div>
      {showEdit && (
        <button
          onClick={onEdit}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          <Icon className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  </Card>
);