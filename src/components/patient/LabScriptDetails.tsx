import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LabScript } from "@/types/labScript";
import { LabScriptContent } from "./lab-script-details/LabScriptContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DesignInfoForm } from "./forms/DesignInfoForm";

interface LabScriptDetailsProps {
  script: LabScript | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (updatedScript: LabScript) => void;
  isEditing?: boolean;
}

export const LabScriptDetails = ({
  script,
  open,
  onOpenChange,
  onEdit,
  isEditing = false,
}: LabScriptDetailsProps) => {
  const [showDesignInfo, setShowDesignInfo] = useState(false);

  const handleDesignInfo = () => {
    console.log("Opening design info form for script:", script?.id);
    setShowDesignInfo(true);
  };

  const handleSaveDesignInfo = (updatedScript: LabScript) => {
    console.log("Saving design info:", updatedScript);
    onEdit(updatedScript);
    setShowDesignInfo(false);
  };

  if (!script) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Lab Script Details</SheetTitle>
          </SheetHeader>
          <LabScriptContent 
            script={script} 
            onEdit={onEdit} 
            isEditing={isEditing}
            onDesignInfo={handleDesignInfo}
          />
        </SheetContent>
      </Sheet>

      <Dialog open={showDesignInfo} onOpenChange={setShowDesignInfo}>
        <DialogContent className="max-w-[1200px] w-full">
          <DialogHeader>
            <DialogTitle>Design Information</DialogTitle>
            <DialogDescription>
              Design details for Lab Request #{script.requestNumber}
            </DialogDescription>
          </DialogHeader>
          <DesignInfoForm
            onClose={() => setShowDesignInfo(false)}
            scriptId={script.id}
            script={script}
            onSave={handleSaveDesignInfo}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};