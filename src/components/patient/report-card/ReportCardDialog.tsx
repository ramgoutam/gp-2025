import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScript } from "@/types/labScript";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BasicInformation } from "./sections/BasicInformation";
import { TreatmentInformation } from "./sections/TreatmentInformation";
import { DesignInformation } from "./sections/DesignInformation";
import { ClinicalInformation } from "./sections/ClinicalInformation";
import { SpecificInstructions } from "./sections/SpecificInstructions";
import { supabase } from "@/integrations/supabase/client";
import { ReportCardData } from "@/types/reportCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: LabScript;
}

export const ReportCardDialog = ({ open, onOpenChange, script }: ReportCardDialogProps) => {
  const [reportData, setReportData] = useState<ReportCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!script.id) return;
      
      console.log("Fetching report card data for script:", script.id);
      setIsLoading(true);

      try {
        const { data: reportCard, error } = await supabase
          .from('report_cards')
          .select(`
            *,
            design_info:design_info_id(*),
            clinical_info:clinical_info_id(*)
          `)
          .eq('lab_script_id', script.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching report card:", error);
          return;
        }

        console.log("Found report card:", reportCard);
        setReportData(reportCard);
      } catch (error) {
        console.error("Error in fetchReportData:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && script.id) {
      fetchReportData();
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('report-card-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'report_cards',
          filter: `lab_script_id=eq.${script.id}`
        },
        async (payload) => {
          console.log("Report card updated:", payload);
          // Refetch the data to get the latest changes
          await fetchReportData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [script.id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>Lab Request Report</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="space-y-6 p-4">
              <BasicInformation script={script} />
              
              <Separator />
              
              <TreatmentInformation script={script} />
              
              {reportData?.design_info && (
                <>
                  <Separator />
                  <DesignInformation 
                    script={{
                      ...script,
                      designInfo: reportData.design_info
                    }} 
                  />
                </>
              )}
              
              {reportData?.clinical_info && (
                <>
                  <Separator />
                  <ClinicalInformation 
                    script={{
                      ...script,
                      clinicalInfo: reportData.clinical_info
                    }} 
                  />
                </>
              )}
              
              {script.specificInstructions && (
                <>
                  <Separator />
                  <SpecificInstructions script={script} />
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};