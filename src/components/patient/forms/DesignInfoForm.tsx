import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScript } from "@/types/labScript";
import { ApplianceSection } from "@/components/lab-script/ApplianceSection";
import { TreatmentSection } from "@/components/lab-script/TreatmentSection";
import { ScrewSection } from "@/components/lab-script/ScrewSection";
import { useToast } from "@/hooks/use-toast";
import { DesignDateSection } from "./design-info/DesignDateSection";
import { LibrarySection } from "./design-info/LibrarySection";
import { ActionsTakenSection } from "./design-info/ActionsTakenSection";
import { PenTool } from "lucide-react";
import { useDesignForm } from "./design-info/useDesignForm";
import { supabase } from "@/integrations/supabase/client";

interface DesignInfoFormProps {
  onClose: () => void;
  scriptId: string;
  script: LabScript;
  onSave: (updatedScript: LabScript) => void;
}

export const DesignInfoForm = ({ 
  onClose, 
  scriptId, 
  script, 
  onSave 
}: DesignInfoFormProps) => {
  const { toast } = useToast();
  const { 
    designData, 
    isSubmitting, 
    handleDesignDataChange, 
    handleSave 
  } = useDesignForm(script, onSave, onClose);

  const handleSubmit = async () => {
    const result = await handleSave(scriptId);
    
    if (result.success) {
      // Update report card status
      const { error: updateError } = await supabase
        .from('report_cards')
        .update({ 
          design_info_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (updateError) {
        console.error('Error updating report card status:', updateError);
        toast({
          title: "Error",
          description: "Failed to update design info status",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Design information saved successfully",
      });
    } else {
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
          applianceType={designData.appliance_type}
        />
        <TreatmentSection
          title="Lower"
          treatment={designData.lower_treatment}
          onTreatmentChange={(value) => handleDesignDataChange("lower_treatment", value)}
          applianceType={designData.appliance_type}
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
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="flex items-center gap-2"
          disabled={isSubmitting}
        >
          <PenTool className="h-4 w-4" />
          {script.designInfo ? 'Update Design Info' : 'Save Design Info'}
        </Button>
      </div>
    </div>
  );
};