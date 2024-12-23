import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplianceSection } from "@/components/lab-script/ApplianceSection";
import { TreatmentSection } from "@/components/lab-script/TreatmentSection";
import { ScrewSection } from "@/components/lab-script/ScrewSection";
import { useToast } from "@/hooks/use-toast";

const IMPLANT_LIBRARIES = ["Nobel Biocare", "Straumann", "Zimmer Biomet", "Dentsply Sirona"];
const TEETH_LIBRARIES = ["Premium", "Standard", "Economy"];

interface DesignInfoFormProps {
  onClose: () => void;
  scriptId: string;
}

export const DesignInfoForm = ({ onClose, scriptId }: DesignInfoFormProps) => {
  const { toast } = useToast();
  const [designData, setDesignData] = React.useState({
    designDate: new Date().toISOString().split('T')[0],
    applianceType: "",
    upperTreatment: "None",
    lowerTreatment: "None",
    screw: "",
    implantLibrary: "",
    teethLibrary: "",
    actionsTaken: "",
  });

  const handleDesignDataChange = (field: string, value: string) => {
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving design info for script:", scriptId, designData);
    toast({
      title: "Design Info Saved",
      description: "The design information has been successfully saved.",
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="designDate">Design Date</Label>
          <Input
            id="designDate"
            type="date"
            value={designData.designDate}
            onChange={(e) => handleDesignDataChange("designDate", e.target.value)}
          />
        </div>
      </div>

      <ApplianceSection
        value={designData.applianceType}
        onChange={(value) => handleDesignDataChange("applianceType", value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <TreatmentSection
          title="Upper"
          treatment={designData.upperTreatment}
          onTreatmentChange={(value) => handleDesignDataChange("upperTreatment", value)}
        />
        <TreatmentSection
          title="Lower"
          treatment={designData.lowerTreatment}
          onTreatmentChange={(value) => handleDesignDataChange("lowerTreatment", value)}
        />
      </div>

      <ScrewSection
        value={designData.screw}
        onChange={(value) => handleDesignDataChange("screw", value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="implantLibrary">Implant Library</Label>
          <Select
            value={designData.implantLibrary}
            onValueChange={(value) => handleDesignDataChange("implantLibrary", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select implant library" />
            </SelectTrigger>
            <SelectContent>
              {IMPLANT_LIBRARIES.map((lib) => (
                <SelectItem key={lib} value={lib}>
                  {lib}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teethLibrary">Teeth Library</Label>
          <Select
            value={designData.teethLibrary}
            onValueChange={(value) => handleDesignDataChange("teethLibrary", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select teeth library" />
            </SelectTrigger>
            <SelectContent>
              {TEETH_LIBRARIES.map((lib) => (
                <SelectItem key={lib} value={lib}>
                  {lib}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="actionsTaken">Designer Actions & Changes Made</Label>
        <Textarea
          id="actionsTaken"
          value={designData.actionsTaken}
          onChange={(e) => handleDesignDataChange("actionsTaken", e.target.value)}
          className="min-h-[100px]"
        />
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