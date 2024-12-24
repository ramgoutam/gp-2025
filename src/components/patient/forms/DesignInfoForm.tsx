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
      // First, check if a report card exists for this lab script
      const { data: existingReport, error: fetchError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      let reportCardId;
      
      if (existingReport) {
        reportCardId = existingReport.id;
      } else {
        // Create new report card
        const { data: newReport, error: createError } = await supabase
          .from('report_cards')
          .insert({
            lab_script_id: script.id,
            patient_id: script.patientId,
            report_status: 'in_progress'
          })
          .select()
          .single();

        if (createError) throw createError;
        reportCardId = newReport.id;
      }

      // Now handle the design info
      const { data: existingDesign } = await supabase
        .from('design_info')
        .select('*')
        .eq('report_card_id', reportCardId)
        .maybeSingle();

      let designOperation;
      if (existingDesign) {
        // Update existing design info
        designOperation = supabase
          .from('design_info')
          .update({
            design_date: designData.design_date,
            appliance_type: designData.appliance_type,
            upper_treatment: designData.upper_treatment,
            lower_treatment: designData.lower_treatment,
            screw: designData.screw,
            implant_library: designData.implant_library,
            teeth_library: designData.teeth_library,
            actions_taken: designData.actions_taken,
          })
          .eq('id', existingDesign.id);
      } else {
        // Create new design info
        designOperation = supabase
          .from('design_info')
          .insert({
            report_card_id: reportCardId,
            design_date: designData.design_date,
            appliance_type: designData.appliance_type,
            upper_treatment: designData.upper_treatment,
            lower_treatment: designData.lower_treatment,
            screw: designData.screw,
            implant_library: designData.implant_library,
            teeth_library: designData.teeth_library,
            actions_taken: designData.actions_taken,
          });
      }

      const { error: saveError } = await designOperation;
      if (saveError) throw saveError;

      // Update the script with the new design info
      const updatedScript: LabScript = {
        ...script,
        designInfo: {
          report_card_id: reportCardId,
          ...designData
        }
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
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};