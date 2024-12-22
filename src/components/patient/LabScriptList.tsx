import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { LabScript } from "./LabScriptsTab";

interface LabScriptListProps {
  labScripts: LabScript[];
  onRowClick: (script: LabScript) => void;
  onEditClick: (script: LabScript) => void;
  onDeleteClick?: (script: LabScript) => void;
}

const getStatusBadge = (status: LabScript["status"]) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <Badge variant="secondary" className={styles[status]}>
      {status?.replace("_", " ") || "pending"}
    </Badge>
  );
};

const getTreatments = (script: LabScript) => {
  if (script.treatments) {
    return script.treatments;
  }
  
  return {
    upper: script.upperTreatment && script.upperTreatment !== "None" ? [script.upperTreatment] : [],
    lower: script.lowerTreatment && script.lowerTreatment !== "None" ? [script.lowerTreatment] : []
  };
};

export const LabScriptList = ({ labScripts, onRowClick, onEditClick, onDeleteClick }: LabScriptListProps) => {
  const handleEditClick = (e: React.MouseEvent, script: LabScript) => {
    e.stopPropagation();
    onEditClick(script);
  };

  const handleDeleteClick = (e: React.MouseEvent, script: LabScript) => {
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(script);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient Name</TableHead>
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
        {labScripts.map((script) => {
          const treatments = getTreatments(script);
          const patientName = `${script.patientFirstName || ''} ${script.patientLastName || ''}`.trim() || 'N/A';
          
          return (
            <TableRow 
              key={script.id}
              className="hover:bg-gray-50"
            >
              <TableCell>{patientName}</TableCell>
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
                  {treatments.upper.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Upper:</span> {treatments.upper.join(", ")}
                    </div>
                  )}
                  {treatments.lower.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Lower:</span> {treatments.lower.join(", ")}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(script.status)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteClick(e, script)}
                    className="p-0 h-auto hover:bg-transparent text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEditClick(e, script)}
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};