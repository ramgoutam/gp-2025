import React from "react";
import { LabScript } from "@/types/labScript";
import { CardActions } from "./CardActions";
import { StatusButton } from "./StatusButton";

export const LabScriptCard = ({
  script,
  onClick,
  onDelete,
  onEdit,
  onStatusChange,
  onDesignInfo
}: {
  script: LabScript;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: (newStatus: LabScript['status']) => void;
  onDesignInfo?: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col p-4" onClick={onClick}>
        <h3 className="text-lg font-semibold">{script.requestNumber}</h3>
        <p className="text-sm text-gray-500">{script.requestDate}</p>
        <p className="text-sm text-gray-500">{script.status}</p>
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <CardActions
          onDelete={onDelete}
          onEdit={onEdit}
        />
        <StatusButton 
          script={script} 
          onStatusChange={onStatusChange}
          onDesignInfo={onDesignInfo}
        />
      </div>
    </div>
  );
};
