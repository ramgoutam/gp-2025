import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ArrowRight, CheckCircle, Stethoscope, FileText } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { ProgressBar } from "../ProgressBar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClinicalInfoForm } from "../forms/ClinicalInfoForm";
import { ReportCardDialog } from "./ReportCardDialog";
import { saveReportCardState, getReportCardState } from '@/utils/reportCardUtils';
import { ReportCardState } from '@/types/reportCard';
import { format } from "date-fns";
import { StatusBadge } from './StatusBadge';
import { ScriptTitle } from './ScriptTitle';

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
  const [reportCardState, setReportCardState] = useState<ReportCardState>({
    reportStatus: script.status,
    isDesignInfoComplete: false,
    isClinicalInfoComplete: false
  });

  useEffect(() => {
    const loadReportCardState = async () => {
      try {
        const savedState = await getReportCardState(script.id);
        if (savedState) {
          setReportCardState(prev => ({
            ...savedState,
            reportStatus: script.status
          }));
        }
      } catch (error) {
        console.error("Error loading report card state:", error);
        toast({
          title: "Error",
          description: "Failed to load report card state",
          variant: "destructive"
        });
      }
    };

    loadReportCardState();
  }, [script.id, script.status]);

  const handleCompleteReport = async () => {
    try {
      const newState = {
        ...reportCardState,
        reportStatus: 'completed'
      };
      
      await saveReportCardState(script.id, newState);
      setReportCardState(newState);
      
      if (onUpdateScript) {
        onUpdateScript({
          ...script,
          status: 'completed'
        });
      }
      
      toast({
        title: "Report Completed",
        description: "The report has been marked as completed.",
      });
    } catch (error) {
      console.error("Error completing report:", error);
      toast({
        title: "Error",
        description: "Failed to complete report",
        variant: "destructive"
      });
    }
  };

  const progressSteps = [
    { 
      label: "Request Created", 
      status: "completed" as const
    },
    { 
      label: "Design Info", 
      status: script.designInfo 
        ? "completed" as const 
        : "current" as const 
    },
    {
      label: "Clinical Info",
      status: script.clinicalInfo 
        ? "completed" as const 
        : script.designInfo
        ? "current" as const 
        : "upcoming" as const
    },
    { 
      label: "Completed", 
      status: (script.designInfo && script.clinicalInfo)
        ? script.status === 'completed'
          ? "completed" as const
          : "current" as const
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
                <ScriptTitle script={script} />
                <StatusBadge status={reportCardState.reportStatus} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>Created: {format(new Date(script.requestDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Due: {format(new Date(script.dueDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Doctor: {script.doctorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Clinic: {script.clinicName}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDesignInfo(script);
                }}
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
              {script.designInfo && script.clinicalInfo && script.status !== 'completed' && (
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
          
          <div className="space-y-4">
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
            onSave={async (updatedScript) => {
              try {
                await saveReportCardState(script.id, {
                  ...reportCardState,
                  isClinicalInfoComplete: true,
                  clinicalInfo: updatedScript.clinicalInfo
                });
                
                if (onUpdateScript) {
                  onUpdateScript(updatedScript);
                }
                
                setShowClinicalInfo(false);
                toast({
                  title: "Clinical Info Saved",
                  description: "The clinical information has been successfully saved.",
                });
              } catch (error) {
                console.error("Error saving clinical info:", error);
                toast({
                  title: "Error",
                  description: "Failed to save clinical information",
                  variant: "destructive"
                });
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <ReportCardDialog
        open={showReportCard}
        onOpenChange={setShowReportCard}
        script={script}
      />
    </>
  );
};