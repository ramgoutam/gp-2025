import React from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const ReportCardContent = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/5">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Patient Report Card</h3>
        </div>
        
        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">No reports available yet</div>
          </Card>
        </div>
      </div>
    </div>
  );
};