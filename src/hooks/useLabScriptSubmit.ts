import { useState } from "react";
import { LabScript } from "@/types/labScript";
import { saveLabScript, updateLabScript } from "@/utils/databaseUtils";
import { useToast } from "@/components/ui/use-toast";

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
    console.log("Processing lab script submission:", formData);

    try {
      if (isEditing && initialData?.id) {
        const updatedScript = await updateLabScript({
          ...formData,
          id: initialData.id
        });
        
        toast({
          title: "Lab Script Updated",
          description: "The lab script has been successfully updated.",
        });
        
        onSubmit?.(updatedScript);
      } else {
        const newScript = await saveLabScript(formData);
        
        toast({
          title: "Lab Script Created",
          description: "The lab script has been successfully created.",
        });
        
        onSubmit?.(newScript);
      }
    } catch (error) {
      console.error("Error saving lab script:", error);
      toast({
        title: "Error",
        description: "Failed to save lab script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};