import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScript } from "../LabScriptsTab";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          <DialogTitle>Report Card Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6 p-4">
            {/* Design Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Design Information</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Design Date</p>
                  <p className="font-medium">{script.designInfo?.designDate || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Implant Library</p>
                  <p className="font-medium">{script.designInfo?.implantLibrary || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Teeth Library</p>
                  <p className="font-medium">{script.designInfo?.teethLibrary || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Actions Taken</p>
                  <p className="font-medium">{script.designInfo?.actionsTaken || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Clinical Information Section */}
            {script.clinicalInfo && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Clinical Information</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Insertion Date</p>
                    <p className="font-medium">{script.clinicalInfo.insertionDate}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Appliance Fit</p>
                    <p className="font-medium">{script.clinicalInfo.applianceFit}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Design Feedback</p>
                    <p className="font-medium">{script.clinicalInfo.designFeedback}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Occlusion</p>
                    <p className="font-medium">{script.clinicalInfo.occlusion}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Esthetics</p>
                    <p className="font-medium">{script.clinicalInfo.esthetics}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Adjustments Made</p>
                    <p className="font-medium">{script.clinicalInfo.adjustmentsMade}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{script.clinicalInfo.material}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Shade</p>
                    <p className="font-medium">{script.clinicalInfo.shade}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};