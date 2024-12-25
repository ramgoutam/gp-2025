import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { StatusButton } from "./StatusButton";
import { LabScript } from "@/types/labScript";

interface LabScriptCardProps {
  script: LabScript;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (script: LabScript, newStatus: LabScript['status']) => void;
}

export const LabScriptCard = ({
  script,
  onClick,
  onEdit,
  onDelete,
  onStatusChange,
}: LabScriptCardProps) => {
  console.log("Handling lab script card:", script);

  const handleStatusChange = (updatedScript: LabScript, newStatus: LabScript['status']) => {
    console.log("Handling status change in LabScriptCard:", updatedScript.id, newStatus);
    onStatusChange(updatedScript, newStatus);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">
                Lab Script #{script.requestNumber || script.id.slice(0, 8)}
              </h3>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Request Date: {format(new Date(script.requestDate), 'MMM dd, yyyy')}</p>
              <p>Due Date: {format(new Date(script.dueDate), 'MMM dd, yyyy')}</p>
              {script.upperTreatment && (
                <p>Upper Treatment: {script.upperTreatment}</p>
              )}
              {script.lowerTreatment && (
                <p>Lower Treatment: {script.lowerTreatment}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="hover:bg-gray-100"
              >
                <Edit2 className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <StatusButton
                script={script}
                status={script.status}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};