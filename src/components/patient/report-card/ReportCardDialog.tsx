import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScript } from "@/types/labScript";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Request Number</p>
                  <p className="font-medium">{script.requestNumber || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{script.status.replace('_', ' ')}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium">{`${script.patientFirstName} ${script.patientLastName}`}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Doctor Name</p>
                  <p className="font-medium">{script.doctorName}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Treatment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Treatment Information</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Upper Treatment</p>
                  <p className="font-medium">{script.upperTreatment}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Lower Treatment</p>
                  <p className="font-medium">{script.lowerTreatment}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Appliance Type</p>
                  <p className="font-medium">{script.applianceType || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Screw Type</p>
                  <p className="font-medium">{script.screwType || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Design Information */}
            {script.designInfo && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Design Information</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Design Date</p>
                    <p className="font-medium">{script.designInfo.design_date}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Implant Library</p>
                    <p className="font-medium">{script.designInfo.implant_library}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Teeth Library</p>
                    <p className="font-medium">{script.designInfo.teeth_library}</p>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm text-gray-500">Actions Taken</p>
                    <p className="font-medium whitespace-pre-wrap">{script.designInfo.actions_taken}</p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Clinical Information */}
            {script.clinicalInfo && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Clinical Information</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Insertion Date</p>
                    <p className="font-medium">{script.clinicalInfo.insertion_date}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Appliance Fit</p>
                    <p className="font-medium">{script.clinicalInfo.appliance_fit}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Design Feedback</p>
                    <p className="font-medium">{script.clinicalInfo.design_feedback}</p>
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
                    <p className="font-medium">{script.clinicalInfo.adjustments_made}</p>
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

            {/* Specific Instructions */}
            {script.specificInstructions && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Specific Instructions</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{script.specificInstructions}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};