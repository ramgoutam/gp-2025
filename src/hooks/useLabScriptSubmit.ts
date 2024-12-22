import { useState } from "react";
import { LabScript } from "@/components/patient/LabScriptsTab";
import { saveLabScript, updateLabScript } from "@/utils/labScriptStorage";
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
      const scriptId = isEditing ? initialData?.id : `${Date.now()}`;
      const submissionData = {
        ...formData,
        id: scriptId,
        status: "pending"
      };

      if (isEditing) {
        updateLabScript(submissionData);
        toast({
          title: "Lab Script Updated",
          description: "The lab script has been successfully updated.",
        });
        onSubmit?.(submissionData);
      } else {
        const saved = saveLabScript(submissionData);
        if (!saved) {
          toast({
            title: "Error",
            description: "A similar lab script already exists. Please check the details and try again.",
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "Lab Script Created",
          description: "The lab script has been successfully created.",
        });
        onSubmit?.(submissionData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};