import React, { useState } from "react";
import { Calendar, Info, Droplet, Wrench, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PreviewCard } from "./PreviewCard";
import { ApplianceCard } from "./ApplianceCard";

interface TreatmentPreviewProps {
  surgeryDate?: string;
  deliveryDate?: string;
  status?: string;
  upperAppliance?: string;
  lowerAppliance?: string;
  nightguard?: string;
  patientId?: string;
  onUpdate?: () => void;
  labScripts?: any[];
}

export const TreatmentPreviewCards = ({
  surgeryDate,
  deliveryDate,
  status = "Pending",
  upperAppliance,
  lowerAppliance,
  nightguard,
  patientId,
  onUpdate,
  labScripts = [],
}: TreatmentPreviewProps) => {
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [newSurgeryDate, setNewSurgeryDate] = useState(surgeryDate || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateSurgeryDate = async () => {
    if (!patientId) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('patients')
        .update({ surgery_date: newSurgeryDate })
        .eq('id', patientId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Surgery date updated successfully",
      });

      onUpdate?.();
      setShowDateDialog(false);
    } catch (error) {
      console.error("Error updating surgery date:", error);
      toast({
        title: "Error",
        description: "Failed to update surgery date",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return undefined;
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return undefined;
    }
  };

  // Find the latest completed lab script with a completed report card
  const latestCompletedScript = labScripts
    ?.filter(script => 
      script.status === 'completed' && 
      script.reportCard?.status === 'completed' &&
      script.reportCard?.design_info &&
      script.reportCard?.clinical_info
    )
    .sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    )[0];

  console.log("Latest completed script with report card:", latestCompletedScript);

  // Get the latest design and clinical info from the report card
  const latestDesignInfo = latestCompletedScript?.reportCard?.design_info;
  const latestClinicalInfo = latestCompletedScript?.reportCard?.clinical_info;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <PreviewCard
          icon={Calendar}
          title="Surgery Date"
          value={formatDate(surgeryDate)}
          className="bg-gradient-to-br from-white to-gray-50"
          showEdit={true}
          onEdit={() => {
            setNewSurgeryDate(surgeryDate || "");
            setShowDateDialog(true);
          }}
        />
        <PreviewCard
          icon={Calendar}
          title="Estimated Delivery"
          value={formatDate(deliveryDate)}
          className="bg-gradient-to-br from-white to-gray-50"
        />
        <PreviewCard
          icon={Info}
          title="Present Status"
          value={status}
          className="bg-gradient-to-br from-white to-gray-50"
        />

        <ApplianceCard
          upperTreatment={latestDesignInfo?.upper_design_name || upperAppliance}
          lowerTreatment={latestDesignInfo?.lower_design_name || lowerAppliance}
          nightguard={nightguard}
        />

        <PreviewCard
          icon={Droplet}
          title="Shade"
          value={latestClinicalInfo?.shade || "Not specified"}
          className="bg-gradient-to-br from-white to-gray-50"
        />
        <PreviewCard
          icon={Wrench}
          title="Screw"
          value={latestDesignInfo?.screw || "Not specified"}
          className="bg-gradient-to-br from-white to-gray-50"
        />
      </div>

      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Surgery Date</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <input
                type="date"
                value={newSurgeryDate}
                onChange={(e) => setNewSurgeryDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSurgeryDate}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};