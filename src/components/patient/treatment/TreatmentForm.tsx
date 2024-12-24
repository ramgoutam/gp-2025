import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Odontogram } from "../medical-record/Odontogram";

interface TreatmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const SHADE_OPTIONS = ["A1", "A2", "A3", "A3.5", "A4", "B1", "B2", "B3", "B4"];
const TREATMENT_OPTIONS = ["None", "Full Arch Fixed", "Denture", "Crown"];

export const TreatmentForm = ({ isOpen, onClose, patientId }: TreatmentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    arch: "",
    shade: "",
    upperTreatment: "",
    lowerTreatment: "",
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

  const showUpperTreatment = formData.arch === "upper" || formData.arch === "dual";
  const showLowerTreatment = formData.arch === "lower" || formData.arch === "dual";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add New Treatment</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
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
                  <SelectContent className="bg-white z-[200]">
                    <SelectItem value="upper">Upper</SelectItem>
                    <SelectItem value="lower">Lower</SelectItem>
                    <SelectItem value="dual">Dual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showUpperTreatment && (
                <div className="space-y-2">
                  <Label htmlFor="upperTreatment">Upper Treatment</Label>
                  <Select
                    value={formData.upperTreatment}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, upperTreatment: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select upper treatment" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[200]">
                      {TREATMENT_OPTIONS.map((treatment) => (
                        <SelectItem key={treatment} value={treatment}>
                          {treatment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showLowerTreatment && (
                <div className="space-y-2">
                  <Label htmlFor="lowerTreatment">Lower Treatment</Label>
                  <Select
                    value={formData.lowerTreatment}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, lowerTreatment: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lower treatment" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[200]">
                      {TREATMENT_OPTIONS.map((treatment) => (
                        <SelectItem key={treatment} value={treatment}>
                          {treatment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="shade">Shade</Label>
                <Select
                  value={formData.shade}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, shade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shade" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[200]">
                    {SHADE_OPTIONS.map((shade) => (
                      <SelectItem key={shade} value={shade}>
                        {shade}
                      </SelectItem>
                    ))}
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

          {/* Right Column - Odontogram */}
          <div className="border rounded-lg p-4">
            <Label className="mb-2 block">Odontogram</Label>
            <Odontogram />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};