import React, { useState } from "react";
import { useDesignForm } from "./design-info/useDesignForm";
import { DesignDateSection } from "./design-info/DesignDateSection";
import { LibrarySection } from "./design-info/LibrarySection";
import { ActionsTakenSection } from "./design-info/ActionsTakenSection";
import { Button } from "@/components/ui/button";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { ApplianceSection } from "@/components/lab-script/ApplianceSection";
import { TreatmentSection } from "@/components/lab-script/TreatmentSection";
import { ScrewSection } from "@/components/lab-script/ScrewSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

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
  onSave,
}: DesignInfoFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const {
    designData,
    isSubmitting,
    handleDesignDataChange,
    handleSave
  } = useDesignForm(script, onSave, onClose);

  console.log("Current design data:", designData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting design info form with data:", designData);
    
    try {
      const result = await handleSave(scriptId);
      if (result.success) {
        if (result.updatedScript) {
          onSave(result.updatedScript);
        }
        setShowSuccessDialog(true); // Show success dialog instead of closing immediately
      } else {
        toast({
          title: "Error",
          description: "Failed to save design information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving design info:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleNavigateToManufacturing = () => {
    navigate("/manufacturing");
    setShowSuccessDialog(false);
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <DesignDateSection
          value={designData.design_date}
          onChange={(value) => handleDesignDataChange('design_date', value)}
        />

        <ApplianceSection
          value={designData.appliance_type || ''}
          onChange={(value) => handleDesignDataChange('appliance_type', value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <TreatmentSection
            title="Upper"
            treatment={designData.upper_treatment || ''}
            onTreatmentChange={(value) => handleDesignDataChange('upper_treatment', value)}
            applianceType={designData.appliance_type || ''}
          />
          <TreatmentSection
            title="Lower"
            treatment={designData.lower_treatment || ''}
            onTreatmentChange={(value) => handleDesignDataChange('lower_treatment', value)}
            applianceType={designData.appliance_type || ''}
          />
        </div>

        <ScrewSection
          value={designData.screw || ''}
          onChange={(value) => handleDesignDataChange('screw', value)}
        />

        <LibrarySection
          implantLibrary={designData.implant_library || ''}
          teethLibrary={designData.teeth_library || ''}
          onImplantLibraryChange={(value) => handleDesignDataChange('implant_library', value)}
          onTeethLibraryChange={(value) => handleDesignDataChange('teeth_library', value)}
        />

        <ActionsTakenSection
          value={designData.actions_taken || ''}
          onChange={(value) => handleDesignDataChange('actions_taken', value)}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Design Info"}
          </Button>
        </div>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription>
              Design information has been submitted successfully and added to Manufacturing Queue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => {
              setShowSuccessDialog(false);
              onClose();
            }}>
              Close
            </Button>
            <Button onClick={handleNavigateToManufacturing}>
              Go to Manufacturing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};