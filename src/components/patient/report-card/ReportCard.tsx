import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClinicalInfoForm } from "../forms/ClinicalInfoForm";
import { ReportCardDialog } from "./ReportCardDialog";
import { ScriptTitle } from './ScriptTitle';
import { ProgressTracking } from './ProgressTracking';
import { ActionButtons } from './ActionButtons';
import { format } from "date-fns";
import { saveReportCardState } from "@/utils/reportCardUtils";
import { InfoStatus } from "@/types/reportCard";

export const ReportCard = ({ 
  script, 
  onDesignInfo, 
  onClinicalInfo, 
  onUpdateScript 
}: {
  script: LabScript;
  onDesignInfo: (script: LabScript) => void;
  onClinicalInfo: (script: LabScript) => void;
  onUpdateScript?: (script: LabScript) => void;
}) => {
  const { toast } = useToast();
  const [showClinicalInfo, setShowClinicalInfo] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);
  const [reportCardState, setReportCardState] = useState<ReportCardState>({
    isDesignInfoComplete: false,
    isClinicalInfoComplete: false,
    designInfoStatus: 'pending',
    clinicalInfoStatus: 'pending'
  });

  useEffect(() => {
    const loadReportCardState = async () => {
      try {
        const { data: reportCard } = await supabase
          .from('report_cards')
          .select('*')
          .eq('lab_script_id', script.id)
          .single();

        if (reportCard) {
          setReportCardState({
            isDesignInfoComplete: !!reportCard.design_info_id,
            isClinicalInfoComplete: !!reportCard.clinical_info_id,
            designInfoStatus: reportCard.design_info_status as InfoStatus,
            clinicalInfoStatus: reportCard.clinical_info_status as InfoStatus
          });
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
  }, [script.id]);

  const handleCompleteReport = async () => {
    try {
      const { data: reportCard } = await supabase
        .from('report_cards')
        .select('id')
        .eq('lab_script_id', script.id)
        .single();

      if (!reportCard) {
        throw new Error('Report card not found');
      }

      const newState = {
        ...reportCardState,
        clinicalInfo: reportCardState.clinicalInfo ? {
          ...reportCardState.clinicalInfo,
          report_card_id: reportCard.id
        } : undefined,
        designInfo: reportCardState.designInfo ? {
          ...reportCardState.designInfo,
          report_card_id: reportCard.id
        } : undefined
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

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-white">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <ScriptTitle script={script} />
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
            <ActionButtons 
              script={script}
              onDesignInfo={onDesignInfo}
              onClinicalInfo={() => onClinicalInfo(script)}
              onComplete={handleCompleteReport}
              designInfoStatus={reportCardState.designInfoStatus}
              clinicalInfoStatus={reportCardState.clinicalInfoStatus}
            />
          </div>
          
          <ProgressTracking 
            script={script} 
            designInfoStatus={reportCardState.designInfoStatus}
            clinicalInfoStatus={reportCardState.clinicalInfoStatus}
          />
          
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

      <ReportCardDialog
        open={showReportCard}
        onOpenChange={setShowReportCard}
        script={script}
      />
    </>
  );
};
