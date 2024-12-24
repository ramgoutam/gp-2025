import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Info, AlignVerticalSpaceBetween, Droplet, Wrench, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TreatmentPreviewProps {
  surgeryDate?: string;
  deliveryDate?: string;
  status?: string;
  upperAppliance?: string;
  lowerAppliance?: string;
  nightguard?: string;
  shade?: string;
  screw?: string;
  patientId?: string;
  onUpdate?: () => void;
}

export const TreatmentPreviewCards = ({
  surgeryDate,
  deliveryDate,
  status = "Pending",
  upperAppliance,
  lowerAppliance,
  nightguard,
  shade,
  screw,
  patientId,
  onUpdate,
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

  const PreviewCard = ({ 
    icon: Icon, 
    title, 
    value, 
    className = "",
    showEdit = false,
    onEdit,
  }: { 
    icon: React.ElementType; 
    title: string; 
    value?: string; 
    className?: string;
    showEdit?: boolean;
    onEdit?: () => void;
  }) => (
    <Card className={`p-4 hover:shadow-lg transition-all duration-300 group relative ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="font-semibold text-gray-900">
            {value || "Not specified"}
          </p>
        </div>
        {showEdit && (
          <button
            onClick={onEdit}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </Card>
  );

  const formatDate = (date?: string) => {
    if (!date) return undefined;
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return undefined;
    }
  };

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
        <Card className="p-4 col-span-full hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
              <AlignVerticalSpaceBetween className="w-5 h-5" />
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-sm font-medium text-gray-500">Latest Appliance</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Upper</p>
                  <p className="font-semibold text-gray-900">{upperAppliance || "None"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Lower</p>
                  <p className="font-semibold text-gray-900">{lowerAppliance || "None"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Nightguard</p>
                  <p className="font-semibold text-gray-900">{nightguard || "None"}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <PreviewCard
          icon={Droplet}
          title="Shade"
          value={shade}
          className="bg-gradient-to-br from-white to-gray-50"
        />
        <PreviewCard
          icon={Wrench}
          title="Screw"
          value={screw}
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