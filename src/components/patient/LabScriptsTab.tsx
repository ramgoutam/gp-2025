import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

export type LabScript = {
  id: string;
  doctorName: string;
  clinicName: string;
  requestDate: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
  treatments: {
    upper: string[];
    lower: string[];
  };
  specificInstructions?: string;
  applianceType?: string;
};

type LabScriptsTabProps = {
  labScripts: LabScript[];
};

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

export const LabScriptsTab = ({ labScripts }: LabScriptsTabProps) => {
  console.log("Rendering LabScriptsTab with scripts:", labScripts);
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);
  const navigate = useNavigate();
  
  const handleRowClick = (script: LabScript) => {
    console.log("Row clicked, script:", script);
    setSelectedScript(script);
  };

  const handleEditClick = (e: React.MouseEvent, scriptId: string) => {
    e.stopPropagation();
    navigate(`/scripts/${scriptId}/edit`);
  };

  return (
    <>
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Appliance Type</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Clinic</TableHead>
              <TableHead>Treatments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labScripts.map((script) => (
              <TableRow 
                key={script.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(script)}
              >
                <TableCell 
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  {script.applianceType || "N/A"}
                </TableCell>
                <TableCell>{format(new Date(script.requestDate), "MMM dd, yyyy")}</TableCell>
                <TableCell>{format(new Date(script.dueDate), "MMM dd, yyyy")}</TableCell>
                <TableCell>{script.doctorName}</TableCell>
                <TableCell>{script.clinicName}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {script.treatments.upper.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Upper:</span> {script.treatments.upper.join(", ")}
                      </div>
                    )}
                    {script.treatments.lower.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Lower:</span> {script.treatments.lower.join(", ")}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(script.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEditClick(e, script.id)}
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={!!selectedScript} onOpenChange={(open) => !open && setSelectedScript(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Lab Script Details</DialogTitle>
          </DialogHeader>
          
          {selectedScript && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Appliance Type</h4>
                  <p>{selectedScript.applianceType || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Doctor</h4>
                  <p>{selectedScript.doctorName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Clinic</h4>
                  <p>{selectedScript.clinicName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Request Date</h4>
                  <p>{format(new Date(selectedScript.requestDate), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Due Date</h4>
                  <p>{format(new Date(selectedScript.dueDate), "MMM dd, yyyy")}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Treatments</h4>
                {selectedScript.treatments.upper.length > 0 && (
                  <div className="mb-2">
                    <span className="font-medium">Upper:</span> {selectedScript.treatments.upper.join(", ")}
                  </div>
                )}
                {selectedScript.treatments.lower.length > 0 && (
                  <div>
                    <span className="font-medium">Lower:</span> {selectedScript.treatments.lower.join(", ")}
                  </div>
                )}
              </div>

              {selectedScript.specificInstructions && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Specific Instructions</h4>
                  <p className="text-sm">{selectedScript.specificInstructions}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Status</h4>
                {getStatusBadge(selectedScript.status)}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedScript(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/scripts/${selectedScript.id}/edit`);
                    setSelectedScript(null);
                  }}
                >
                  Edit Lab Script
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};