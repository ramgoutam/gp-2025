import React from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const EmptyState = () => {
  return (
    <Card className="p-12 border border-dashed border-gray-200 bg-gray-50/50">
      <div className="text-center text-gray-500">
        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
          <FileText className="w-8 h-8 text-primary/60" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reports available</h3>
        <p className="text-sm text-gray-500">Create a new report to get started tracking patient progress</p>
      </div>
    </Card>
  );
};