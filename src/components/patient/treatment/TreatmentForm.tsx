import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TreatmentFormProps {
  patientId: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const TREATMENT_OPTIONS = ["None", "Full Arch Fixed", "Denture", "Crown"];

export const TreatmentForm = ({ patientId, onClose, onSubmitSuccess }: TreatmentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    treatmentType: "",
    upperTreatment: "",
    lowerTreatment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting treatment form:", formData);
    
    if (!formData.treatmentType) {
      toast({
        title: "Error",
        description: "Please select a treatment type",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('patients')
        .update({
          treatment_type: formData.treatmentType,
          upper_treatment: formData.upperTreatment,
          lower_treatment: formData.lowerTreatment,
        })
        .eq('id', patientId);

      if (error) throw error;

      console.log("Treatment saved successfully");
      toast({
        title: "Success",
        description: "Treatment has been saved successfully",
      });
      
      onSubmitSuccess();
    } catch (error) {
      console.error("Error saving treatment:", error);
      toast({
        title: "Error",
        description: "Failed to save treatment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showUpperTreatment = formData.treatmentType === "upper" || formData.treatmentType === "dual";
  const showLowerTreatment = formData.treatmentType === "lower" || formData.treatmentType === "dual";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="treatmentType">Treatment Type</Label>
          <Select
            value={formData.treatmentType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, treatmentType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select treatment type" />
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
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Treatment"}
        </Button>
      </div>
    </form>
  );
};