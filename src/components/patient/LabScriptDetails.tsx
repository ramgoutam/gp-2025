import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LabScript } from "./LabScriptsTab";
import { LabScriptForm } from "../LabScriptForm";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Maximize } from "lucide-react";

interface LabScriptDetailsProps {
  script: LabScript | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (updatedScript: LabScript) => void;
  isEditing?: boolean;
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

export const LabScriptDetails = ({ script, open, onOpenChange, onEdit, isEditing = false }: LabScriptDetailsProps) => {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!script) return null;

  const handleEdit = (updatedData: LabScript) => {
    console.log("Handling edit with updated data:", updatedData);
    onEdit(updatedData);
  };

  const dialogContentClass = isMaximized 
    ? "max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh]" 
    : "max-w-4xl"; // Matching create lab script popup size

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${dialogContentClass} overflow-hidden`}>
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle>{isEditing ? 'Edit Lab Script' : 'Lab Script Details'}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMaximized(!isMaximized)}
            className="h-8 w-8"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-full max-h-[calc(90vh-120px)]">
          {isEditing ? (
            <LabScriptForm
              initialData={script}
              onSubmit={handleEdit}
              isEditing={true}
            />
          ) : (
            <div className="space-y-4 p-4">
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
                {script.treatments.upper.length > 0 && (
                  <div className="mb-2">
                    <span className="font-medium">Upper:</span> {script.treatments.upper.join(", ")}
                  </div>
                )}
                {script.treatments.lower.length > 0 && (
                  <div>
                    <span className="font-medium">Lower:</span> {script.treatments.lower.join(", ")}
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
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};