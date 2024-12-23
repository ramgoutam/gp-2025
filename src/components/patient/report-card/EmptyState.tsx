import React from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card className="p-8">
      <div className="text-center text-gray-500">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No reports available</h3>
        <p className="text-sm text-gray-500">Create a new report to get started</p>
      </div>
    </Card>
  );
};