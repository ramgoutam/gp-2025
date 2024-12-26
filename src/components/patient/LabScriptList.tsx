import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { getStatusBadge } from "./lab-script/StatusBadge";
import { TreatmentInfo } from "./lab-script/TreatmentInfo";
import { ActionButtons } from "./lab-script/ActionButtons";

interface LabScriptListProps {
  labScripts: LabScript[];
  onRowClick: (script: LabScript) => void;
  onEditClick: (script: LabScript) => void;
  onDeleteClick?: (script: LabScript) => void;
}

const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "N/A";
    console.log("Formatting date:", dateString);
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy");
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

export const LabScriptList = ({ labScripts, onRowClick, onEditClick, onDeleteClick }: LabScriptListProps) => {
  const navigate = useNavigate();

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

  const handlePatientClick = (e: React.MouseEvent, patientId: string) => {
    e.stopPropagation();
    navigate(`/patient/${patientId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient Name</TableHead>
          <TableHead>Appliance Type</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Treatments</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {labScripts.map((script) => {
          const patientName = `${script.patientFirstName || ''} ${script.patientLastName || ''}`.trim() || 'N/A';
          
          return (
            <TableRow 
              key={script.id}
              className="hover:bg-gray-50"
            >
              <TableCell 
                onClick={(e) => handlePatientClick(e, script.id)}
                className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {patientName}
              </TableCell>
              <TableCell 
                className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                onClick={() => onRowClick(script)}
              >
                {script.applianceType || "N/A"}
              </TableCell>
              <TableCell>{formatDate(script.requestDate)}</TableCell>
              <TableCell>{formatDate(script.dueDate)}</TableCell>
              <TableCell>
                <TreatmentInfo script={script} />
              </TableCell>
              <TableCell>{getStatusBadge(script.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ActionButtons script={script} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEditClick(e, script)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteClick(e, script)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};