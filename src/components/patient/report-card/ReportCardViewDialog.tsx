import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { LabScript } from "../LabScriptsTab";
import { format } from "date-fns";

interface ReportCardViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: LabScript;
}

export const ReportCardViewDialog = ({ open, onOpenChange, script }: ReportCardViewDialogProps) => {
  const handlePrint = () => {
    console.log("Printing report card for script:", script.id);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lab Report Card - ${script.requestNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; margin-bottom: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            @media print {
              @page { size: A4; margin: 20mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lab Report Card</h1>
            <p>Generated on ${format(new Date(), "MMM dd, yyyy")}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Basic Information</div>
            <div class="grid">
              <p>Request Number: ${script.requestNumber}</p>
              <p>Status: ${script.status.replace('_', ' ')}</p>
              <p>Patient: ${script.patientFirstName} ${script.patientLastName}</p>
              <p>Doctor: ${script.doctorName}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Treatment Information</div>
            <div class="grid">
              <p>Upper Treatment: ${script.upperTreatment}</p>
              <p>Lower Treatment: ${script.lowerTreatment}</p>
              <p>Appliance Type: ${script.applianceType || 'Not specified'}</p>
              <p>Screw Type: ${script.screwType || 'Not specified'}</p>
            </div>
          </div>

          ${script.designInfo ? `
            <div class="section">
              <div class="section-title">Design Information</div>
              <div class="grid">
                <p>Design Date: ${script.designInfo.designDate}</p>
                <p>Implant Library: ${script.designInfo.implantLibrary}</p>
                <p>Teeth Library: ${script.designInfo.teethLibrary}</p>
              </div>
              <div>
                <div class="section-title">Actions Taken:</div>
                <p>${script.designInfo.actionsTaken}</p>
              </div>
            </div>
          ` : ''}

          ${script.clinicalInfo ? `
            <div class="section">
              <div class="section-title">Clinical Information</div>
              <div class="grid">
                <p>Insertion Date: ${script.clinicalInfo.insertionDate}</p>
                <p>Appliance Fit: ${script.clinicalInfo.applianceFit}</p>
                <p>Design Feedback: ${script.clinicalInfo.designFeedback}</p>
                <p>Occlusion: ${script.clinicalInfo.occlusion}</p>
                <p>Esthetics: ${script.clinicalInfo.esthetics}</p>
                <p>Adjustments: ${script.clinicalInfo.adjustmentsMade}</p>
                <p>Material: ${script.clinicalInfo.material}</p>
                <p>Shade: ${script.clinicalInfo.shade}</p>
              </div>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle>Lab Request Report #{script.requestNumber}</DialogTitle>
          {script.status === 'completed' && (
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrint}
              className="h-8 w-8"
            >
              <Printer className="h-4 w-4" />
            </Button>
          )}
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