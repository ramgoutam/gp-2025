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
import { useToast } from "./ui/use-toast";
import { LabScript } from "./patient/LabScriptsTab";

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
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    doctorName: initialData?.doctorName || "",
    clinicName: initialData?.clinicName || "",
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
  });

  const [fileUploads, setFileUploads] = React.useState<Record<string, FileUpload>>(() => {
    if (initialData?.fileUploads) {
      const formattedUploads: Record<string, FileUpload> = {};
      Object.entries(initialData.fileUploads).forEach(([key, files]: [string, any]) => {
        const fileArray = Array.isArray(files) ? files : [files];
        const validFiles = fileArray.map(file => {
          if (file instanceof File) {
            return file;
          }
          if (file.name && file.type && file.size) {
            return new File([file], file.name, {
              type: file.type,
              lastModified: file.lastModified || Date.now()
            });
          }
          return null;
        }).filter(Boolean);

        formattedUploads[key] = {
          id: key,
          files: validFiles
        };
      });
      console.log("Initialized file uploads with converted files:", formattedUploads);
      return formattedUploads;
    }
    return {};
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use existing ID when editing, or generate a new one for new scripts
    const scriptId = isEditing ? initialData?.id : `${Date.now()}`;

    const submissionData = {
      ...formData,
      id: scriptId,
      patientFirstName: patientData?.firstName || formData.firstName,
      patientLastName: patientData?.lastName || formData.lastName,
      fileUploads: Object.entries(fileUploads).reduce((acc, [key, upload]) => {
        if (upload.files.length > 0) {
          acc[key] = upload.files;
        }
        return acc;
      }, {} as Record<string, File[]>)
    };
    
    console.log(`Lab script ${isEditing ? 'updated' : 'submitted'} with ID:`, scriptId, submissionData);
    
    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
    
    // When editing, replace the existing script
    // When creating new, ensure no duplicate IDs exist
    if (isEditing) {
      const updatedScripts = existingScripts.map((script: LabScript) => 
        script.id === submissionData.id ? submissionData : script
      );
      localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    } else {
      // Check for duplicates before adding
      const isDuplicate = existingScripts.some((script: LabScript) => script.id === submissionData.id);
      if (!isDuplicate) {
        const newScripts = [...existingScripts, submissionData];
        localStorage.setItem('labScripts', JSON.stringify(newScripts));
        onSubmit?.(submissionData);
      } else {
        console.error("Duplicate script ID detected:", submissionData.id);
        toast({
          title: "Error",
          description: "A lab script with this ID already exists. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    toast({
      title: isEditing ? "Lab Script Updated" : "Lab Script Created",
      description: isEditing ? "The lab script has been successfully updated." : "The lab script has been successfully created.",
    });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
          />
        </div>
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
          <Label htmlFor="clinicName">Clinic Name</Label>
          <Input
            id="clinicName"
            name="clinicName"
            value={formData.clinicName}
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
          />
          <TreatmentSection
            title="Lower"
            treatment={formData.lowerTreatment}
            onTreatmentChange={(value) =>
              setFormData(prev => ({ ...prev, lowerTreatment: value }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <ScrewSection
          value={formData.screwType}
          onChange={(value) => setFormData(prev => ({ ...prev, screwType: value }))}
        />
        <VDOSection
          value={formData.vdoOption}
          onChange={(value) => setFormData(prev => ({ ...prev, vdoOption: value }))}
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
        <Button type="submit">{isEditing ? 'Update' : 'Submit'} Lab Script</Button>
      </div>
    </form>
  );
};