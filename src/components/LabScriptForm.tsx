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

type FileUpload = {
  id: string;
  file: File | null;
};

export const LabScriptForm = ({ onSubmit }: { onSubmit?: (data: any) => void }) => {
  const [formData, setFormData] = React.useState({
    doctorName: "",
    clinicName: "",
    requestDate: "",
    dueDate: "",
    firstName: "",
    lastName: "",
    applianceType: "",
    shade: "",
    specificInstructions: "",
    upperTreatment: "None",
    lowerTreatment: "None",
    screwType: "",
    vdoOption: "",
  });

  const [fileUploads, setFileUploads] = React.useState<Record<string, FileUpload>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lab script form submitted:", {
      ...formData,
      fileUploads: Object.entries(fileUploads).reduce((acc, [key, upload]) => {
        if (upload.file) {
          acc[key] = upload.file;
        }
        return acc;
      }, {} as Record<string, File>)
    });
    
    onSubmit?.({
      ...formData,
      fileUploads: Object.entries(fileUploads).reduce((acc, [key, upload]) => {
        if (upload.file) {
          acc[key] = upload.file;
        }
        return acc;
      }, {} as Record<string, File>)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (itemId: string, file: File | null) => {
    setFileUploads(prev => ({
      ...prev,
      [itemId]: { id: itemId, file }
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
        <Button type="submit">Submit Lab Script</Button>
      </div>
    </form>
  );
};