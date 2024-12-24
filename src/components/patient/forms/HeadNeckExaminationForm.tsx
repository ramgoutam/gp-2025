import React from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/patient/form/FormField";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HeadNeckExaminationFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export const HeadNeckExaminationForm = ({ patientId, onSuccess }: HeadNeckExaminationFormProps) => {
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Submitting head and neck examination form for patient:", patientId);
      const { error } = await supabase
        .from('head_neck_examinations')
        .insert([
          {
            patient_id: patientId,
            notes,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Examination form has been saved successfully.",
      });

      if (onSuccess) onSuccess();
      setNotes("");
    } catch (error) {
      console.error("Error saving examination form:", error);
      toast({
        title: "Error",
        description: "Failed to save examination form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Head and Neck Examination</h3>
        <p className="text-sm text-gray-500">
          Record the results of the head and neck examination. Additional fields will be added based on the PDF template.
        </p>
        
        <div className="space-y-4">
          <FormField
            id="notes"
            label="Notes"
            type="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter examination notes..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {isSubmitting ? "Saving..." : "Save Examination"}
        </Button>
      </div>
    </form>
  );
};