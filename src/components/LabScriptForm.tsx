import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DigitalDataSection } from "./lab-script/DigitalDataSection";
import { TreatmentSection } from "./lab-script/TreatmentSection";
import { ApplianceSection } from "./lab-script/ApplianceSection";
import { ScrewSection } from "./lab-script/ScrewSection";
import { VDOSection } from "./lab-script/VDOSection";
import { DesignNameSection } from "./lab-script/DesignNameSection";
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
}

export const LabScriptForm = ({ 
  onSubmit, 
  initialData, 
  isEditing = false,
  patientData 
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
      patientFirstName: patientData?.firstName || formData.firstName,
      patientLastName: patientData?.lastName || formData.lastName,
      fileUploads: Object.entries(fileUploads).reduce((acc, [key, upload]) => {
        if (upload.files.length > 0) {
          acc[key] = upload.files;
        }
        return acc;
      }, {} as Record<string, File[]>)
    };

    await handleSubmit(submissionData, initialData);
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

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requestDate">Request Date</Label>
          <Input
            id="requestDate"
            name="requestDate"
            type="date"
            value={formData.requestDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <ApplianceSection
        value={formData.applianceType}
        onChange={(value) => setFormData(prev => ({ ...prev, applianceType: value }))}
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
        <ScrewSection
          value={formData.screwType}
          onChange={(value) => setFormData(prev => ({ ...prev, screwType: value }))}
        />
        <VDOSection
          value={formData.vdoOption}
          onChange={(value) => setFormData(prev => ({ ...prev, vdoOption: value }))
          }
        />
      </div>

      <DigitalDataSection
        uploads={fileUploads}
        onFileChange={handleFileChange}
        applianceType={formData.applianceType}
      />

      <div className="space-y-2">
        <Label htmlFor="specificInstructions">Specific Instructions</Label>
        <Textarea
          id="specificInstructions"
          name="specificInstructions"
          value={formData.specificInstructions}
          onChange={handleChange}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : isEditing ? 'Update' : 'Submit'} Lab Script
        </Button>
      </div>
    </form>
  );
};