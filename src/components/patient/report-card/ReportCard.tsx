import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Stethoscope, Calendar, User, FileCheck, ArrowRight } from "lucide-react";
import { LabScript } from "../LabScriptsTab";

interface ReportCardProps {
  script: LabScript;
  onDesignInfo: (script: LabScript) => void;
  onClinicInfo: (script: LabScript) => void;
}

export const ReportCard = ({ script, onDesignInfo, onClinicInfo }: ReportCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 group">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h4 className="font-semibold text-lg text-gray-900">Lab Request #{script.requestNumber}</h4>
              <Badge variant="outline" className={`${getStatusColor(script.status)} px-3 py-1 uppercase text-xs font-medium`}>
                {script.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Created: {new Date(script.requestDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>Dr. {script.doctorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-gray-400" />
                <span>Due: {new Date(script.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDesignInfo(script)}
              className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30"
            >
              <Settings className="h-4 w-4" />
              Design Info
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClinicInfo(script)}
              className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30"
            >
              <Stethoscope className="h-4 w-4" />
              Clinical Info
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Button>
          </div>
        </div>
        
        {script.designInfo && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h5 className="font-medium text-sm text-gray-700 mb-3">Design Information</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Design Date:</span>
                <span className="text-gray-900 font-medium">{script.designInfo.designDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Implant Library:</span>
                <span className="text-gray-900 font-medium">{script.designInfo.implantLibrary}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};