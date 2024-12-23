import React from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportCardHeaderProps {
  patientName: string;
  onCreateReport: () => void;
}

export const ReportCardHeader = ({ patientName, onCreateReport }: ReportCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-xl text-gray-900">Patient Report Card</h3>
          <p className="text-sm text-gray-500">
            View and manage {patientName}'s medical reports and lab scripts
          </p>
        </div>
      </div>
      <Button 
        onClick={onCreateReport} 
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Plus className="h-4 w-4" />
        Create Report
      </Button>
    </div>
  );
};