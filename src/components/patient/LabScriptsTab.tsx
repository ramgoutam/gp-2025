import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  
  return (
    <>
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Clinic</TableHead>
              <TableHead>Treatments</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labScripts.map((script) => (
              <TableRow 
                key={script.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedScript(script)}
              >
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};