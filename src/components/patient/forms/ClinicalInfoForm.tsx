import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const FIT_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const FEEDBACK_OPTIONS = ["Positive", "Neutral", "Needs Improvement"];
const OCCLUSION_OPTIONS = ["Perfect", "Slight Adjustment Needed", "Major Adjustment Needed"];
const ESTHETICS_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const ADJUSTMENTS_OPTIONS = ["None", "Minor", "Major"];
const MATERIAL_OPTIONS = ["Zirconia", "PMMA", "Titanium", "Other"];
const SHADE_OPTIONS = ["A1", "A2", "A3", "A3.5", "A4", "B1", "B2", "B3", "B4"];

interface ClinicalInfoFormProps {
  onClose: () => void;
  scriptId: string;
}

export const ClinicalInfoForm = ({ onClose, scriptId }: ClinicalInfoFormProps) => {
  const { toast } = useToast();
  const [clinicalData, setClinicalData] = React.useState({
    insertionDate: "",
    applianceFit: "",
    designFeedback: "",
    occlusion: "",
    esthetics: "",
    adjustmentsMade: "",
    material: "",
    shade: "",
  });

  const handleClinicalDataChange = (field: string, value: string) => {
    setClinicalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving clinical info for script:", scriptId, clinicalData);
    toast({
      title: "Clinical Info Saved",
      description: "The clinical information has been successfully saved.",
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="insertionDate">Insertion Date</Label>
          <Input
            id="insertionDate"
            type="date"
            value={clinicalData.insertionDate}
            onChange={(e) => handleClinicalDataChange("insertionDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="applianceFit">Appliance Fit</Label>
          <Select
            value={clinicalData.applianceFit}
            onValueChange={(value) => handleClinicalDataChange("applianceFit", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fit quality" />
            </SelectTrigger>
            <SelectContent>
              {FIT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="designFeedback">Design Feedback</Label>
          <Select
            value={clinicalData.designFeedback}
            onValueChange={(value) => handleClinicalDataChange("designFeedback", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select feedback" />
            </SelectTrigger>
            <SelectContent>
              {FEEDBACK_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occlusion">Occlusion</Label>
          <Select
            value={clinicalData.occlusion}
            onValueChange={(value) => handleClinicalDataChange("occlusion", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select occlusion status" />
            </SelectTrigger>
            <SelectContent>
              {OCCLUSION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="esthetics">Esthetics</Label>
          <Select
            value={clinicalData.esthetics}
            onValueChange={(value) => handleClinicalDataChange("esthetics", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select esthetics quality" />
            </SelectTrigger>
            <SelectContent>
              {ESTHETICS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adjustmentsMade">Adjustments Made</Label>
          <Select
            value={clinicalData.adjustmentsMade}
            onValueChange={(value) => handleClinicalDataChange("adjustmentsMade", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select adjustments" />
            </SelectTrigger>
            <SelectContent>
              {ADJUSTMENTS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Select
            value={clinicalData.material}
            onValueChange={(value) => handleClinicalDataChange("material", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shade">Shade</Label>
          <Select
            value={clinicalData.shade}
            onValueChange={(value) => handleClinicalDataChange("shade", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shade" />
            </SelectTrigger>
            <SelectContent>
              {SHADE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};