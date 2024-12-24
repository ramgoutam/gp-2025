import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScript } from "@/types/labScript";
import { FormFields } from "./clinical-info/FormFields";
import { useClinicalInfo } from "./clinical-info/useClinicalInfo";

interface ClinicalInfoFormProps {
  onClose: () => void;
  script: LabScript;
  onSave: (updatedScript: LabScript) => void;
}

export const ClinicalInfoForm = ({ onClose, script, onSave }: ClinicalInfoFormProps) => {
  const { formData, handleFieldChange, handleSubmit } = useClinicalInfo(script, onSave, onClose);

  return (
    <div className="w-full">
      <ScrollArea className="h-full pr-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormFields 
            formData={formData}
            onFieldChange={handleFieldChange}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Clinical Info
            </Button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
};