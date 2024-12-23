import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScript } from "../LabScriptsTab";
import { format } from "date-fns";

interface ReportCardViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: LabScript;
}

export const ReportCardViewDialog = ({ open, onOpenChange, script }: ReportCardViewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Lab Request Report #{script.requestNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm mb-2">Patient Information</h3>
              <p className="text-sm text-gray-600">
                Name: {script.patientFirstName} {script.patientLastName}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-2">Request Details</h3>
              <p className="text-sm text-gray-600">
                Created: {format(new Date(script.requestDate), "MMM dd, yyyy")}
              </p>
              <p className="text-sm text-gray-600">
                Due: {format(new Date(script.dueDate), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {script.designInfo && (
            <div>
              <h3 className="font-medium text-sm mb-2">Design Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>Design Date: {script.designInfo.designDate}</p>
                <p>Implant Library: {script.designInfo.implantLibrary}</p>
                <p>Teeth Library: {script.designInfo.teethLibrary}</p>
                <p>Actions Taken: {script.designInfo.actionsTaken}</p>
              </div>
            </div>
          )}

          {script.clinicalInfo && (
            <div>
              <h3 className="font-medium text-sm mb-2">Clinical Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>Insertion Date: {script.clinicalInfo.insertionDate}</p>
                <p>Appliance Fit: {script.clinicalInfo.applianceFit}</p>
                <p>Design Feedback: {script.clinicalInfo.designFeedback}</p>
                <p>Occlusion: {script.clinicalInfo.occlusion}</p>
                <p>Esthetics: {script.clinicalInfo.esthetics}</p>
                <p>Adjustments: {script.clinicalInfo.adjustmentsMade}</p>
                <p>Material: {script.clinicalInfo.material}</p>
                <p>Shade: {script.clinicalInfo.shade}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};