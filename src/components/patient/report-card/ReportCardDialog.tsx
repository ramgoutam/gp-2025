import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScript } from "@/types/labScript";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

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
                  <p className="text-sm text-gray-500">Doctor Name</p>
                  <p className="font-medium">{script.doctorName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Clinic Name</p>
                  <p className="font-medium">{script.clinicName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Request Date</p>
                  <p className="font-medium">{format(new Date(script.requestDate), 'MMM dd, yyyy')}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{format(new Date(script.dueDate), 'MMM dd, yyyy')}</p>
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
                  <p className="font-medium">{script.upperTreatment || 'None'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Lower Treatment</p>
                  <p className="font-medium">{script.lowerTreatment || 'None'}</p>
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
                    <p className="font-medium">{format(new Date(script.designInfo.design_date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Upper Design Name</p>
                    <p className="font-medium">{script.designInfo.upper_design_name || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Lower Design Name</p>
                    <p className="font-medium">{script.designInfo.lower_design_name || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Implant Library</p>
                    <p className="font-medium">{script.designInfo.implant_library || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Teeth Library</p>
                    <p className="font-medium">{script.designInfo.teeth_library || 'Not specified'}</p>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <p className="text-sm text-gray-500">Actions Taken</p>
                    <p className="font-medium whitespace-pre-wrap">{script.designInfo.actions_taken || 'None'}</p>
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
                    <p className="font-medium">{script.clinicalInfo.insertion_date ? format(new Date(script.clinicalInfo.insertion_date), 'MMM dd, yyyy') : 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Appliance Fit</p>
                    <p className="font-medium">{script.clinicalInfo.appliance_fit || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Design Feedback</p>
                    <p className="font-medium">{script.clinicalInfo.design_feedback || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Occlusion</p>
                    <p className="font-medium">{script.clinicalInfo.occlusion || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Esthetics</p>
                    <p className="font-medium">{script.clinicalInfo.esthetics || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Adjustments Made</p>
                    <p className="font-medium">{script.clinicalInfo.adjustments_made || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{script.clinicalInfo.material || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Shade</p>
                    <p className="font-medium">{script.clinicalInfo.shade || 'Not specified'}</p>
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