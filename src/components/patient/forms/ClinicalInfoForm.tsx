import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScript } from "../LabScriptsTab";

const FIT_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];

interface ClinicalInfoFormProps {
  onClose: () => void;
  script: LabScript;
  onSave: (updatedScript: LabScript) => void;
}

export const ClinicalInfoForm = ({ onClose, script, onSave }: ClinicalInfoFormProps) => {
  const [formData, setFormData] = React.useState({
    insertionDate: "",
    applianceFit: "",
  });

  console.log("Rendering ClinicalInfoForm with script:", script);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting clinical info:", formData);

    const updatedScript: LabScript = {
      ...script,
      clinicalInfo: {
        ...formData,
      },
    };

    onSave(updatedScript);
    onClose();
  };

  return (
    <ScrollArea className="h-[400px] w-full pr-4">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="insertionDate">Insertion Date</Label>
            <Input
              id="insertionDate"
              type="date"
              value={formData.insertionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, insertionDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applianceFit">Appliance Fit</Label>
            <Select
              value={formData.applianceFit}
              onValueChange={(value) => setFormData(prev => ({ ...prev, applianceFit: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fit quality" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[200]">
                {FIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Clinical Info
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
};