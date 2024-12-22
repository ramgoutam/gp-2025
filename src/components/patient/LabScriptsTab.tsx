import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
  
  return (
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
            <TableRow key={script.id}>
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
  );
};