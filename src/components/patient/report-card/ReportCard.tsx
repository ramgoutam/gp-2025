import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Calendar, User, FileCheck, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { LabScript } from "../LabScriptsTab";
import { ProgressBar } from "../ProgressBar";
import { useToast } from "@/hooks/use-toast";

interface ReportCardProps {
  script: LabScript;
  onDesignInfo: (script: LabScript) => void;
  onUpdateScript?: (updatedScript: LabScript) => void;
}

export const ReportCard = ({ script, onDesignInfo, onUpdateScript }: ReportCardProps) => {
  const { toast } = useToast();

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

  const handleCompleteReport = () => {
    console.log("Completing report for script:", script.id);
    const updatedScript: LabScript = { 
      ...script, 
      status: "completed" as const 
    };
    
    // Update localStorage
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
    const updatedScripts = scripts.map((s: any) => {
      if (s.id === script.id) {
        return updatedScript;
      }
      return s;
    });
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    
    // Update parent component state
    if (onUpdateScript) {
      onUpdateScript(updatedScript);
    }

    toast({
      title: "Report Completed",
      description: "The lab script has been marked as completed.",
    });
  };

  // Define progress steps with proper status logic
  const hasDesignInfo = script.designInfo && 
    script.designInfo.designDate &&
    script.designInfo.implantLibrary &&
    script.designInfo.teethLibrary;

  const progressSteps = [
    { 
      label: "Request Created", 
      status: "completed" as const
    },
    { 
      label: "Design Info", 
      status: hasDesignInfo 
        ? "completed" as const 
        : "current" as const 
    },
    { 
      label: "Completed", 
      status: script.status === 'completed'
        ? "completed" as const
        : hasDesignInfo
          ? "current" as const 
          : "upcoming" as const 
    }
  ];

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-white">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <h4 className="font-semibold text-lg text-gray-900">Lab Request #{script.requestNumber}</h4>
              <Badge variant="outline" className={`${getStatusColor(script.status)} px-3 py-1 uppercase text-xs font-medium`}>
                {script.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary/60" />
                <span>Created: {new Date(script.requestDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-primary/60" />
                <span>Dr. {script.doctorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary/60" />
                <span>Due: {new Date(script.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-primary/60" />
                <span>Status: {script.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDesignInfo(script)}
              className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
            >
              <Settings className="h-4 w-4" />
              Design Info
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
            </Button>
            {hasDesignInfo && script.status !== 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompleteReport}
                className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200 group-hover:border-green-300 transition-all duration-300"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Report
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </Button>
            )}
          </div>
        </div>
        
        <ProgressBar steps={progressSteps} />
        
        {script.designInfo && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-300">
            <h5 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary/60" />
              Design Information
            </h5>
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