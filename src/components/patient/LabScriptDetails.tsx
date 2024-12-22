import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LabScript } from "./LabScriptsTab";
import { LabScriptForm } from "../LabScriptForm";
import { useState } from "react";

interface LabScriptDetailsProps {
  script: LabScript | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (updatedScript: LabScript) => void;
}

const getStatusBadge = (status: LabScript["status"]) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <Badge variant="secondary" className={styles[status]}>
      {status.replace("_", " ")}
    </Badge>
  );
};

export const LabScriptDetails = ({ script, open, onOpenChange, onEdit }: LabScriptDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!script) return null;

  const handleEdit = (updatedData: LabScript) => {
    onEdit(updatedData);
    setIsEditing(false);
  };

  // Transform the data to match the expected format
  const treatments = {
    upper: script.upperTreatment !== "None" ? [script.upperTreatment] : [],
    lower: script.lowerTreatment !== "None" ? [script.lowerTreatment] : []
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Lab Script Details</DialogTitle>
        </DialogHeader>
        
        {isEditing ? (
          <LabScriptForm
            initialData={script}
            onSubmit={handleEdit}
            isEditing={true}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500">Appliance Type</h4>
                <p>{script.applianceType || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Doctor</h4>
                <p>{script.doctorName}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Clinic</h4>
                <p>{script.clinicName}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Request Date</h4>
                <p>{format(new Date(script.requestDate), "MMM dd, yyyy")}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Due Date</h4>
                <p>{format(new Date(script.dueDate), "MMM dd, yyyy")}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">Treatments</h4>
              {treatments.upper.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Upper:</span> {treatments.upper.join(", ")}
                </div>
              )}
              {treatments.lower.length > 0 && (
                <div>
                  <span className="font-medium">Lower:</span> {treatments.lower.join(", ")}
                </div>
              )}
            </div>

            {script.specificInstructions && (
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Specific Instructions</h4>
                <p className="text-sm">{script.specificInstructions}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-2">Status</h4>
              {getStatusBadge(script.status || "pending")}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
              >
                Edit Lab Script
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};