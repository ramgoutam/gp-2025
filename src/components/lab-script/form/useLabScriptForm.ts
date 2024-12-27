import React from "react";
import { useLabScriptSubmit } from "@/hooks/useLabScriptSubmit";

type FileUpload = {
  id: string;
  files: File[];
};

interface UseLabScriptFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  patientData?: {
    firstName: string;
    lastName: string;
  };
  patientId?: string;
}

export const useLabScriptForm = ({
  onSubmit,
  initialData,
  isEditing = false,
  patientData,
  patientId
}: UseLabScriptFormProps) => {
  const { handleSubmit, isSubmitting } = useLabScriptSubmit(onSubmit, isEditing);
  const [formData, setFormData] = React.useState({
    requestDate: initialData?.requestDate || "",
    dueDate: initialData?.dueDate || "",
    firstName: patientData?.firstName || initialData?.firstName || "",
    lastName: patientData?.lastName || initialData?.lastName || "",
    applianceType: initialData?.applianceType || "",
    shade: initialData?.shade || "",
    material: initialData?.material || "",
    specificInstructions: initialData?.specificInstructions || "",
    upperTreatment: initialData?.upperTreatment || "None",
    lowerTreatment: initialData?.lowerTreatment || "None",
    screwType: initialData?.screwType || "",
    vdoOption: initialData?.vdoOption || "",
    upperDesignName: initialData?.upperDesignName || "",
    lowerDesignName: initialData?.lowerDesignName || "",
    manufacturingSource: initialData?.manufacturingSource || "",
    manufacturingType: initialData?.manufacturingType || "",
  });

  const [fileUploads, setFileUploads] = React.useState<Record<string, FileUpload>>(() => {
    if (initialData?.fileUploads) {
      const formattedUploads: Record<string, FileUpload> = {};
      Object.entries(initialData.fileUploads).forEach(([key, files]: [string, any]) => {
        const fileArray = Array.isArray(files) ? files : [files];
        const validFiles = fileArray
          .map(file => {
            if (file instanceof File) return file;
            if (file.name && file.type && file.size) {
              return new File([file], file.name, {
                type: file.type,
                lastModified: file.lastModified || Date.now()
              });
            }
            return null;
          })
          .filter(Boolean);

        formattedUploads[key] = {
          id: key,
          files: validFiles
        };
      });
      return formattedUploads;
    }
    return {};
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (itemId: string, files: File[]) => {
    console.log("Handling file change for", itemId, "with files:", files);
    setFileUploads(prev => ({
      ...prev,
      [itemId]: { id: itemId, files }
    }));
  };

  const handleManufacturingChange = (source: string, type: string) => {
    console.log("Updating manufacturing details:", { source, type });
    setFormData(prev => ({
      ...prev,
      manufacturingSource: source,
      manufacturingType: type
    }));
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const submissionData = {
      ...formData,
      patientId,
      patientFirstName: patientData?.firstName || formData.firstName,
      patientLastName: patientData?.lastName || formData.lastName,
      fileUploads: Object.entries(fileUploads).reduce((acc, [key, upload]) => {
        if (upload.files.length > 0) {
          acc[key] = upload.files;
        }
        return acc;
      }, {} as Record<string, File[]>)
    };

    console.log("Submitting form with data:", submissionData);
    try {
      await handleSubmit(submissionData, initialData);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return {
    formData,
    fileUploads,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleManufacturingChange,
    onFormSubmit
  };
};