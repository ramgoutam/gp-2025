import React from "react";
import { Button } from "@/components/ui/button";
import { ApplianceSection } from "@/components/lab-script/ApplianceSection";
import { TreatmentSection } from "@/components/lab-script/TreatmentSection";
import { ScrewSection } from "@/components/lab-script/ScrewSection";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { DesignDateSection } from "./design-info/DesignDateSection";
import { LibrarySection } from "./design-info/LibrarySection";
import { ActionsTakenSection } from "./design-info/ActionsTakenSection";
import { PenTool } from "lucide-react";

interface DesignInfoFormProps {
  onClose: () => void;
  scriptId: string;
  script: LabScript;
  onSave: (updatedScript: LabScript) => void;
}

export const DesignInfoForm = ({ onClose, scriptId, script, onSave }: DesignInfoFormProps) => {
  const { toast } = useToast();
  const [designData, setDesignData] = React.useState({
    design_date: script.designInfo?.design_date || new Date().toISOString().split('T')[0],
    appliance_type: script.applianceType || "",
    upper_treatment: script.upperTreatment || "None",
    lower_treatment: script.lowerTreatment || "None",
    screw: script.screwType || "",
    implant_library: script.designInfo?.implant_library || "",
    teeth_library: script.designInfo?.teeth_library || "",
    actions_taken: script.designInfo?.actions_taken || "",
  });

  const handleDesignDataChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.log("Saving design info for script:", scriptId, designData);
    
    try {
      // Get the report card for this lab script
      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (reportCardError) {
        console.error("Error fetching report card:", reportCardError);
        throw reportCardError;
      }

      if (!reportCard) {
        console.error("No report card found for lab script:", script.id);
        throw new Error("No report card found for this lab script");
      }

      let designInfo;

      if (reportCard.design_info_id) {
        // Update existing design info
        console.log("Updating existing design info:", reportCard.design_info_id);
        const { data: updatedDesignInfo, error: updateError } = await supabase
          .from('design_info')
          .update({
            ...designData,
            updated_at: new Date().toISOString()
          })
          .eq('id', reportCard.design_info_id)
          .select()
          .maybeSingle();

        if (updateError) {
          console.error("Error updating design info:", updateError);
          throw updateError;
        }

        if (!updatedDesignInfo) {
          console.error("Failed to update design info");
          throw new Error("Failed to update design info");
        }

        designInfo = updatedDesignInfo;
      } else {
        // Create new design info
        console.log("Creating new design info");
        const { data: newDesignInfo, error: createError } = await supabase
          .from('design_info')
          .insert({
            ...designData,
            report_card_id: reportCard.id
          })
          .select()
          .maybeSingle();

        if (createError) {
          console.error("Error creating design info:", createError);
          throw createError;
        }

        if (!newDesignInfo) {
          console.error("Failed to create design info");
          throw new Error("Failed to create design info");
        }

        // Update report card with design info id
        const { error: updateError } = await supabase
          .from('report_cards')
          .update({ 
            design_info_id: newDesignInfo.id,
            design_info_status: 'completed'
          })
          .eq('id', reportCard.id);

        if (updateError) {
          console.error("Error updating report card:", updateError);
          throw updateError;
        }

        designInfo = newDesignInfo;
      }

      // Update the script with the new design info
      const updatedScript: LabScript = {
        ...script,
        designInfo: designInfo,
        applianceType: designData.appliance_type,
        upperTreatment: designData.upper_treatment,
        lowerTreatment: designData.lower_treatment,
        screwType: designData.screw
      };

      onSave(updatedScript);
      
      toast({
        title: script.designInfo ? "Design Info Updated" : "Design Info Saved",
        description: `The design information has been successfully ${script.designInfo ? 'updated' : 'saved'}.`,
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
        <DesignDateSection
          value={designData.design_date}
          onChange={(value) => handleDesignDataChange("design_date", value)}
        />
      </div>

      <ApplianceSection
        value={designData.appliance_type}
        onChange={(value) => handleDesignDataChange("appliance_type", value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <TreatmentSection
          title="Upper"
          treatment={designData.upper_treatment}
          onTreatmentChange={(value) => handleDesignDataChange("upper_treatment", value)}
        />
        <TreatmentSection
          title="Lower"
          treatment={designData.lower_treatment}
          onTreatmentChange={(value) => handleDesignDataChange("lower_treatment", value)}
        />
      </div>

      <ScrewSection
        value={designData.screw}
        onChange={(value) => handleDesignDataChange("screw", value)}
      />

      <LibrarySection
        implantLibrary={designData.implant_library}
        teethLibrary={designData.teeth_library}
        onImplantLibraryChange={(value) => handleDesignDataChange("implant_library", value)}
        onTeethLibraryChange={(value) => handleDesignDataChange("teeth_library", value)}
      />

      <ActionsTakenSection
        value={designData.actions_taken}
        onChange={(value) => handleDesignDataChange("actions_taken", value)}
      />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <PenTool className="h-4 w-4" />
          {script.designInfo ? 'Update Design Info' : 'Save Design Info'}
        </Button>
      </div>
    </div>
  );
};