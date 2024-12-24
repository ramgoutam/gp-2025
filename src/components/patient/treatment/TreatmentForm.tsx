import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TreatmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const SHADE_OPTIONS = ["A1", "A2", "A3", "A3.5", "A4", "B1", "B2", "B3", "B4"];

export const TreatmentForm = ({ isOpen, onClose, patientId }: TreatmentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    arch: "",
    shade: "",
    applianceType: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting treatment form:", formData);
    
    try {
      // TODO: Implement form submission logic
      toast({
        title: "Success",
        description: "Treatment added successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting treatment:", error);
      toast({
        title: "Error",
        description: "Failed to add treatment",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Treatment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="arch">Arch</Label>
              <Select
                value={formData.arch}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, arch: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select arch type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upper">Upper</SelectItem>
                  <SelectItem value="lower">Lower</SelectItem>
                  <SelectItem value="dual">Dual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shade">Shade</Label>
              <Select
                value={formData.shade}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, shade: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shade" />
                </SelectTrigger>
                <SelectContent>
                  {SHADE_OPTIONS.map((shade) => (
                    <SelectItem key={shade} value={shade}>
                      {shade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applianceType">Appliance Type</Label>
              <Select
                value={formData.applianceType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, applianceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appliance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type1">Type 1</SelectItem>
                  {/* Add more appliance types as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Treatment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};