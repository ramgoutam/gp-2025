import React, { useEffect } from "react";
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

  useEffect(() => {
    const fetchExistingDesignInfo = async () => {
      try {
        console.log("Fetching design info for script:", scriptId);
        const { data: reportCard, error: reportCardError } = await supabase
          .from('report_cards')
          .select(`
            *,
            design_info (*)
          `)
          .eq('lab_script_id', scriptId)
          .maybeSingle();

        if (reportCardError) {
          console.error("Error fetching report card:", reportCardError);
          throw reportCardError;
        }

        if (reportCard?.design_info) {
          console.log("Found existing design info:", reportCard.design_info);
          setDesignData({
            design_date: reportCard.design_info.design_date || new Date().toISOString().split('T')[0],
            appliance_type: reportCard.design_info.appliance_type || "",
            upper_treatment: reportCard.design_info.upper_treatment || "None",
            lower_treatment: reportCard.design_info.lower_treatment || "None",
            screw: reportCard.design_info.screw || "",
            implant_library: reportCard.design_info.implant_library || "",
            teeth_library: reportCard.design_info.teeth_library || "",
            actions_taken: reportCard.design_info.actions_taken || "",
          });
        } else {
          console.log("No existing design info found, using default values");
        }
      } catch (error) {
        console.error("Error in fetchExistingDesignInfo:", error);
        toast({
          title: "Error",
          description: "Failed to fetch existing design information",
          variant: "destructive"
        });
      }
    };

    fetchExistingDesignInfo();
  }, [scriptId]);

  const handleDesignDataChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setDesignData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.log("Saving design info for script:", scriptId, designData);
    
    try {
      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', scriptId)
        .maybeSingle();

      if (reportCardError) {
        console.error("Error fetching report card:", reportCardError);
        throw reportCardError;
      }

      if (!reportCard) {
        console.error("No report card found for script:", scriptId);
        throw new Error("No report card found for this script");
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
          .single();

        if (updateError) {
          console.error("Error updating design info:", updateError);
          throw updateError;
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
          .single();

        if (createError) {
          console.error("Error creating design info:", createError);
          throw createError;
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
        title: reportCard.design_info_id ? "Design Info Updated" : "Design Info Saved",
        description: `The design information has been successfully ${reportCard.design_info_id ? 'updated' : 'saved'}.`,
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