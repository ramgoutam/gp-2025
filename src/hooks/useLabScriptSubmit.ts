import { useState } from "react";
import { LabScript } from "@/types/labScript";
import { saveLabScript, updateLabScript } from "@/utils/databaseUtils";
import { useToast } from "@/hooks/use-toast";

export const useLabScriptSubmit = (
  onSubmit?: (data: any) => void,
  isEditing = false
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any, initialData?: any) => {
    if (isSubmitting) {
      console.log("Submission already in progress, preventing duplicate");
      return;
    }

    setIsSubmitting(true);
    console.log("Processing lab script submission. Is editing?", isEditing);
    console.log("Form data:", formData);
    console.log("Initial data:", initialData);

    try {
      if (!formData.patientId) {
        console.error("Missing patientId in form data:", formData);
        throw new Error("Patient ID is required to create a lab script");
      }

      let savedScript;
      if (isEditing && initialData?.id) {
        console.log("Updating existing lab script with ID:", initialData.id);
        savedScript = await updateLabScript({
          ...formData,
          id: initialData.id,
          status: initialData.status || 'pending'
        });
        console.log("Lab script updated successfully:", savedScript);
      } else {
        console.log("Creating new lab script for patient:", formData.patientId);
        savedScript = await saveLabScript(formData);
        console.log("New lab script created successfully:", savedScript);
      }

      if (onSubmit) {
        console.log("Calling onSubmit callback with saved script");
        await onSubmit(savedScript);
      }

      toast({
        title: isEditing ? "Lab Script Updated" : "Lab Script Created",
        description: `The lab script has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });
    } catch (error) {
      console.error("Error in lab script submission:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save lab script. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};