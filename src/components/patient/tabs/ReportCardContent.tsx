import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const ReportCardContent = () => {
  const { toast } = useToast();

  const handleCreateReport = () => {
    console.log("Creating new lab report");
    toast({
      title: "Coming Soon",
      description: "Lab report creation feature is under development",
    });
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
    </div>
  );
};