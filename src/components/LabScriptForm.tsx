import React from "react";
import { DigitalDataSection } from "./lab-script/DigitalDataSection";
import { TreatmentSection } from "./lab-script/TreatmentSection";
import { ApplianceSection } from "./lab-script/ApplianceSection";
import { ScrewSection } from "./lab-script/ScrewSection";
import { VDOSection } from "./lab-script/VDOSection";
import { DesignNameSection } from "./lab-script/DesignNameSection";
import { FormHeader } from "./lab-script/FormHeader";
import { FormFooter } from "./lab-script/FormFooter";
import { ManufacturingSection } from "./lab-script/ManufacturingSection";
import { useLabScriptSubmit } from "@/hooks/useLabScriptSubmit";

type FileUpload = {
  id: string;
  files: File[];
};

interface LabScriptFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  patientData?: {
    firstName: string;
    lastName: string;
  };
  patientId?: string;
}

export const LabScriptForm = ({ 
  onSubmit, 
  initialData, 
  isEditing = false,
  patientData,
  patientId
}: LabScriptFormProps) => {
  const { handleSubmit, isSubmitting } = useLabScriptSubmit(onSubmit, isEditing);
  const [formData, setFormData] = React.useState({
    requestDate: initialData?.requestDate || "",
    dueDate: initialData?.dueDate || "",
    firstName: patientData?.firstName || initialData?.firstName || "",
    lastName: patientData?.lastName || initialData?.lastName || "",
    applianceType: initialData?.applianceType || "",
    shade: initialData?.shade || "",
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

  const shouldShowScrewSection = () => {
    return formData.upperTreatment !== "Denture" && 
           formData.lowerTreatment !== "Denture" && 
           formData.applianceType !== "Nightguard";
  };

  const shouldShowVDOSection = () => {
    return formData.applianceType !== "Nightguard";
  };

  const handleManufacturingChange = (source: string, type: string) => {
    console.log("Updating manufacturing details:", { source, type });
    setFormData(prev => ({
      ...prev,
      manufacturingSource: source,
      manufacturingType: type
    }));
  };

  const isManufacturingEditable = true;

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      <FormHeader
        requestDate={formData.requestDate}
        dueDate={formData.dueDate}
        onChange={handleChange}
      />

      <ApplianceSection
        value={formData.applianceType}
        onChange={(value) => setFormData(prev => ({ ...prev, applianceType: value }))}
        onManufacturingChange={handleManufacturingChange}
      />

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Treatment</h3>
        <div className="grid grid-cols-2 gap-8">
          <TreatmentSection
            title="Upper"
            treatment={formData.upperTreatment}
            onTreatmentChange={(value) => 
              setFormData(prev => ({ ...prev, upperTreatment: value }))
            }
            applianceType={formData.applianceType}
          />
          <TreatmentSection
            title="Lower"
            treatment={formData.lowerTreatment}
            onTreatmentChange={(value) =>
              setFormData(prev => ({ ...prev, lowerTreatment: value }))
            }
            applianceType={formData.applianceType}
          />
        </div>
      </div>

      {formData.applianceType && (
        <DesignNameSection
          applianceType={formData.applianceType}
          upperTreatment={formData.upperTreatment}
          lowerTreatment={formData.lowerTreatment}
          upperDesignName={formData.upperDesignName}
          lowerDesignName={formData.lowerDesignName}
          onUpperDesignNameChange={(value) => 
            setFormData(prev => ({ ...prev, upperDesignName: value }))
          }
          onLowerDesignNameChange={(value) =>
            setFormData(prev => ({ ...prev, lowerDesignName: value }))
          }
        />
      )}

      <div className="grid grid-cols-2 gap-8">
        {shouldShowScrewSection() && (
          <ScrewSection
            value={formData.screwType}
            onChange={(value) => setFormData(prev => ({ ...prev, screwType: value }))}
          />
        )}
        {shouldShowVDOSection() && (
          <VDOSection
            value={formData.vdoOption}
            onChange={(value) => setFormData(prev => ({ ...prev, vdoOption: value }))
            }
          />
        )}
      </div>

      {formData.applianceType && (
        <ManufacturingSection
          manufacturingSource={formData.manufacturingSource}
          manufacturingType={formData.manufacturingType}
          onManufacturingSourceChange={(value) => 
            setFormData(prev => ({ ...prev, manufacturingSource: value }))
          }
          onManufacturingTypeChange={(value) =>
            setFormData(prev => ({ ...prev, manufacturingType: value }))
          }
          isEditable={isManufacturingEditable}
        />
      )}

      <DigitalDataSection
        uploads={fileUploads}
        onFileChange={handleFileChange}
        applianceType={formData.applianceType}
      />

      <FormFooter
        specificInstructions={formData.specificInstructions}
        onChange={handleChange}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
      />
    </form>
  );
};
