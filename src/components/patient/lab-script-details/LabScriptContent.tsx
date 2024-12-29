import React from "react";
import { LabScript } from "@/types/labScript";
import { HeaderSection } from "./HeaderSection";
import { TreatmentsSection } from "./TreatmentsSection";
import { ApplianceSection } from "./sections/ApplianceSection";
import { ManufacturingSection } from "./sections/ManufacturingSection";
import { ApplianceNumberSection } from "./sections/ApplianceNumberSection";
import { StatusButton } from "./StatusButton";
import { CardActions } from "./CardActions";
import { HoldReasonInfo } from "./HoldReasonInfo";

interface LabScriptContentProps {
  script: LabScript;
  onEdit: (updatedScript: LabScript) => void;
  isEditing?: boolean;
  onDesignInfo?: () => void;
}

export const LabScriptContent = ({ 
  script, 
  onEdit,
  isEditing = false,
  onDesignInfo
}: LabScriptContentProps) => {
  const handleStatusChange = (newStatus: LabScript['status']) => {
    console.log("Status changed to:", newStatus);
    onEdit({ ...script, status: newStatus });
  };

  const handleView = () => {
    console.log("View clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  return (
    <div className="space-y-6 py-6">
      <HeaderSection script={script} />
      
      <div className="flex justify-between items-center">
        <StatusButton 
          script={script} 
          onStatusChange={handleStatusChange}
          onDesignInfo={onDesignInfo}
        />
        <CardActions 
          onView={handleView}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {script.holdReason && (
        <HoldReasonInfo script={script} />
      )}

      <TreatmentsSection script={script} />
      <ApplianceSection script={script} />
      <ApplianceNumberSection script={script} />
      <ManufacturingSection script={script} />
    </div>
  );
};