import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { LabScript } from "./LabScriptsTab";

interface LabScriptListProps {
  labScripts: LabScript[];
  onRowClick: (script: LabScript) => void;
  onEditClick: (script: LabScript) => void;
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

export const LabScriptList = ({ labScripts, onRowClick, onEditClick }: LabScriptListProps) => {
  const handleEditClick = (e: React.MouseEvent, script: LabScript) => {
    e.stopPropagation(); // Prevent row click when clicking edit
    onEditClick(script);
  };

  return (
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
            className="hover:bg-gray-50"
          >
            <TableCell 
              className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => onRowClick(script)}
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
                onClick={(e) => handleEditClick(e, script)}
                className="p-0 h-auto hover:bg-transparent"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};