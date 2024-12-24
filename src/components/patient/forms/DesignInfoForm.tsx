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
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";

const IMPLANT_LIBRARIES = ["Nobel Biocare", "Straumann", "Zimmer Biomet", "Dentsply Sirona"];
const TEETH_LIBRARIES = ["Premium", "Standard", "Economy"];

interface DesignInfoFormProps {
  onClose: () => void;
  scriptId: string;
  script: LabScript;
  onSave: (updatedScript: LabScript) => void;
}

export const DesignInfoForm = ({ onClose, scriptId, script, onSave }: DesignInfoFormProps) => {
  const { toast } = useToast();
  const [designData, setDesignData] = React.useState({
    designDate: script.designInfo?.designDate || new Date().toISOString().split('T')[0],
    applianceType: script.applianceType || "",
    upperTreatment: script.upperTreatment || "None",
    lowerTreatment: script.lowerTreatment || "None",
    screw: script.screwType || "",
    implantLibrary: script.designInfo?.implantLibrary || "",
    teethLibrary: script.designInfo?.teethLibrary || "",
    actionsTaken: script.designInfo?.actionsTaken || "",
  });

  const handleDesignDataChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.log("Saving design info for script:", scriptId, designData);
    
    try {
      // First, check if a report card exists for this lab script
      const { data: existingReport } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .single();

      if (existingReport) {
        // Update existing report card without changing the status
        const { error: updateError } = await supabase
          .from('report_cards')
          .update({
            design_info: designData
          })
          .eq('id', existingReport.id);

        if (updateError) throw updateError;
      } else {
        // Create new report card
        const { error: insertError } = await supabase
          .from('report_cards')
          .insert({
            lab_script_id: script.id,
            design_info: designData
          });

        if (insertError) throw insertError;
      }

      const updatedScript: LabScript = {
        ...script,
        designInfo: designData
      };

      onSave(updatedScript);
      
      toast({
        title: "Design Info Saved",
        description: "The design information has been successfully saved.",
      });

      onClose();
    } catch (error) {
      console.error("Error saving design info:", error);
      toast({
        title: "Error",
        description: "Failed to save design information",
        variant: "destructive"
      });
    }
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
            <SelectContent className="bg-white z-[200]">
              {IMPLANT_LIBRARIES.map((lib) => (
                <SelectItem key={lib} value={lib} className="hover:bg-gray-100">
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
            <SelectContent className="bg-white z-[200]">
              {TEETH_LIBRARIES.map((lib) => (
                <SelectItem key={lib} value={lib} className="hover:bg-gray-100">
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
