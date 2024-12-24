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
    console.log("Processing lab script submission with data:", formData);

    try {
      if (isEditing && initialData?.id) {
        console.log("Updating existing lab script:", initialData.id);
        const updatedScript = await updateLabScript({
          ...formData,
          id: initialData.id
        });
        
        console.log("Lab script updated successfully:", updatedScript);
        toast({
          title: "Lab Script Updated",
          description: "The lab script has been successfully updated.",
        });
        
        onSubmit?.(updatedScript);
      } else {
        console.log("Creating new lab script with patient ID:", formData.patientId);
        if (!formData.patientId) {
          throw new Error("Patient ID is required to create a lab script");
        }
        
        const newScript = await saveLabScript(formData);
        console.log("New lab script created successfully:", newScript);
        
        toast({
          title: "Lab Script Created",
          description: "The lab script has been successfully created.",
        });
        
        onSubmit?.(newScript);
      }
    } catch (error) {
      console.error("Error in lab script submission:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save lab script. Please try again.",
        variant: "destructive"
      });
      throw error; // Re-throw to be handled by the component
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};