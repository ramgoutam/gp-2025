import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

  React.useEffect(() => {
    const loadExistingData = () => {
      console.log('Loading existing clinical data for script:', scriptId);
      const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
      const script = scripts.find((s: any) => s.id === scriptId);
      if (script?.clinicalInfo) {
        console.log('Found existing clinical data:', script.clinicalInfo);
        setClinicalData(script.clinicalInfo);
      }
    };
    loadExistingData();
  }, [scriptId]);

  const handleClinicalDataChange = (field: string, value: string) => {
    console.log(`Updating clinical info field ${field} to:`, value);
    setClinicalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving clinical info for script:", scriptId, clinicalData);
    
    // Get current scripts from localStorage
    const scripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
    
    // Find and update the specific script
    const updatedScripts = scripts.map((script: any) => {
      if (script.id === scriptId) {
        // Consider the form complete if at least one field is filled
        const hasAnyValue = Object.values(clinicalData).some(value => value !== "");
        return {
          ...script,
          clinicalInfo: clinicalData,
          status: hasAnyValue ? 'in_progress' : script.status
        };
      }
      return script;
    });
    
    // Save back to localStorage
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    
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
          <input
            id="insertionDate"
            type="date"
            value={clinicalData.insertionDate}
            onChange={(e) => handleClinicalDataChange("insertionDate", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
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
            <SelectContent className="bg-white z-[200]">
              {FIT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-gray-100">
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
            <SelectContent className="bg-white z-[200]">
              {FEEDBACK_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-gray-100">
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
            <SelectContent className="bg-white z-[200]">
              {OCCLUSION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-gray-100">
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
            <SelectContent className="bg-white z-[200]">
              {ESTHETICS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-gray-100">
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
            <SelectContent className="bg-white z-[200]">
              {ADJUSTMENTS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-gray-100">
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
            <SelectContent className="bg-white z-[200]">
              {MATERIAL_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-gray-100">
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
            <SelectContent className="bg-white z-[200]">
              {SHADE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-gray-100">
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
