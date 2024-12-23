import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabReportForm } from "../lab-report/LabReportForm";

export const ReportCardContent = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  const handleCreateReport = () => {
    console.log("Opening create report dialog");
    setShowCreateDialog(true);
  };

  const handleSubmitReport = (data: any) => {
    console.log("Submitting report with data:", data);
    // Here you would typically save the report data
    toast({
      title: "Report Created",
      description: "The lab report has been successfully created.",
    });
    setShowCreateDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/5">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Patient Report Card</h3>
          </div>
          <Button onClick={handleCreateReport} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
        
        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">No reports available yet</div>
          </Card>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Lab Report</DialogTitle>
          </DialogHeader>
          <LabReportForm
            onSubmit={handleSubmitReport}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};