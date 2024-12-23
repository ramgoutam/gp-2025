import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Calendar, User, FileCheck, ArrowRight, Clock, CheckCircle, Stethoscope, FileText } from "lucide-react";
import { LabScript } from "../LabScriptsTab";
import { ProgressBar } from "../ProgressBar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClinicalInfoForm } from "../forms/ClinicalInfoForm";
import { ReportCardViewDialog } from "./ReportCardViewDialog";
import { getReportCardState, saveReportCardState, ReportCardState } from './ReportCardState';

interface ReportCardProps {
  script: LabScript;
  onDesignInfo: (script: LabScript) => void;
  onClinicalInfo: (script: LabScript) => void;
  onUpdateScript?: (updatedScript: LabScript) => void;
}

export const ReportCard = ({ script, onDesignInfo, onClinicalInfo, onUpdateScript }: ReportCardProps) => {
  const { toast } = useToast();
  const [showClinicalInfo, setShowClinicalInfo] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);
  const [state, setState] = useState<ReportCardState>(() => getReportCardState(script.id));

  useEffect(() => {
    setState(getReportCardState(script.id));
  }, [script.id]);

  useEffect(() => {
    saveReportCardState(script.id, state);
  }, [script.id, state]);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Design Pending';
      case 'in_progress':
        return 'Design In Progress';
      case 'completed':
        return 'Design Completed';
      default:
        return status.replace('_', ' ');
    }
  };

  const handleCompleteReport = () => {
    console.log("Completing report for script:", script.id);
    setState(prev => ({
      ...prev,
      reportStatus: 'completed'
    }));
    
    toast({
      title: "Report Completed",
      description: "The report has been marked as completed.",
    });
  };

  const handleClinicalInfoSave = (updatedScript: LabScript) => {
    console.log("Saving clinical info:", updatedScript);
    if (onUpdateScript) {
      onUpdateScript(updatedScript);
    }
    setState(prev => ({
      ...prev,
      isClinicalInfoComplete: true
    }));
    setShowClinicalInfo(false);
    toast({
      title: "Clinical Info Saved",
      description: "The clinical information has been successfully saved.",
    });
  };

  const progressSteps = [
    { 
      label: "Request Created", 
      status: "completed" as const
    },
    { 
      label: "Design Info", 
      status: state.isDesignInfoComplete 
        ? "completed" as const 
        : "current" as const 
    },
    {
      label: "Clinical Info",
      status: state.isClinicalInfoComplete 
        ? "completed" as const 
        : state.isDesignInfoComplete
        ? "current" as const 
        : "upcoming" as const
    },
    { 
      label: "Completed", 
      status: state.reportStatus === 'completed'
        ? "completed" as const
        : state.isClinicalInfoComplete
          ? "current" as const 
          : "upcoming" as const 
    }
  ];

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-white">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h4 className="font-semibold text-lg text-gray-900">Lab Request #{script.requestNumber}</h4>
                <Badge variant="outline" className={`${getStatusColor(script.status)} px-3 py-1 uppercase text-xs font-medium`}>
                  {getStatusText(script.status)}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClinicalInfo(true)}
                className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
              >
                <Stethoscope className="h-4 w-4" />
                Clinical Info
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </Button>
            </div>
          </div>
          
          <ProgressBar steps={progressSteps} />
          
          {script.designInfo && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-300">
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
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportCard(true)}
                className="w-full flex items-center justify-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
              >
                <FileText className="h-4 w-4" />
                View Report Card
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showClinicalInfo} onOpenChange={setShowClinicalInfo}>
        <DialogContent className="max-w-[800px] w-full">
          <DialogHeader>
            <DialogTitle>Clinical Information</DialogTitle>
          </DialogHeader>
          <ClinicalInfoForm
            onClose={() => setShowClinicalInfo(false)}
            script={script}
            onSave={handleClinicalInfoSave}
          />
        </DialogContent>
      </Dialog>

      <ReportCardViewDialog
        open={showReportCard}
        onOpenChange={setShowReportCard}
        script={script}
      />
    </>
  );
};
