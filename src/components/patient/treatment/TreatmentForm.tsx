import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TreatmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

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
              <Input
                id="shade"
                value={formData.shade}
                onChange={(e) => setFormData((prev) => ({ ...prev, shade: e.target.value }))}
                placeholder="Enter shade"
              />
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