import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScript } from "@/types/labScript";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BasicInformation } from "./sections/BasicInformation";
import { TreatmentInformation } from "./sections/TreatmentInformation";
import { DesignInformation } from "./sections/DesignInformation";
import { ClinicalInformation } from "./sections/ClinicalInformation";
import { SpecificInstructions } from "./sections/SpecificInstructions";

interface ReportCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: LabScript;
}

export const ReportCardDialog = ({ open, onOpenChange, script }: ReportCardDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>Lab Request Report</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6 p-4">
            <BasicInformation script={script} />
            
            <Separator />
            
            <TreatmentInformation script={script} />
            
            {script.designInfo && (
              <>
                <Separator />
                <DesignInformation script={script} />
              </>
            )}
            
            {script.clinicalInfo && (
              <>
                <Separator />
                <ClinicalInformation script={script} />
              </>
            )}
            
            {script.specificInstructions && (
              <>
                <Separator />
                <SpecificInstructions script={script} />
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};