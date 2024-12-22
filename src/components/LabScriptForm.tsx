import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { DigitalDataSection } from "./lab-script/DigitalDataSection";

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
  });

  const [fileUploads, setFileUploads] = React.useState<Record<string, FileUpload>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lab script form submitted:", formData);
    console.log("File uploads:", fileUploads);
    
    // Combine form data with file uploads
    const submitData = {
      ...formData,
      fileUploads: Object.entries(fileUploads).reduce((acc, [key, upload]) => {
        if (upload.file) {
          acc[key] = upload.file;
        }
        return acc;
      }, {} as Record<string, File>)
    };
    
    onSubmit?.(submitData);
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

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Treatment</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <h4 className="font-medium">Upper</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="upperFullArchFixed" />
                <label htmlFor="upperFullArchFixed">Full Arch Fixed</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="upperDenture" />
                <label htmlFor="upperDenture">Denture</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="upperCrown" />
                <label htmlFor="upperCrown">Crown</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="upperNightguard" />
                <label htmlFor="upperNightguard">Nightguard</label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Lower</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="lowerFullArchFixed" />
                <label htmlFor="lowerFullArchFixed">Full Arch Fixed</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lowerDenture" />
                <label htmlFor="lowerDenture">Denture</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lowerCrown" />
                <label htmlFor="lowerCrown">Crown</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lowerNightguard" />
                <label htmlFor="lowerNightguard">Nightguard</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-medium">Screw</h4>
          <div className="space-y-2">
            {["Rosen", "Dess", "SIN", "DC Screw", "Others"].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={`screw${item}`} />
                <label htmlFor={`screw${item}`}>{item}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-medium">VDO Details</h4>
          <div className="space-y-2">
            {[
              "Open upto 4 mm without calling Doctor",
              "Open upto 4 mm with calling Doctor",
              "Open VDO based on requirement",
              "No changes required in VDO"
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={`vdo${item}`} />
                <label htmlFor={`vdo${item}`}>{item}</label>
              </div>
            ))}
          </div>
        </div>
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
