import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Play, Pause, StopCircle, CheckCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    paused: "bg-orange-100 text-orange-800",
    hold: "bg-red-100 text-red-800"
  };

  return (
    <Badge variant="secondary" className={styles[status] || styles.pending}>
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
  const { toast } = useToast();

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

  const handleStatusUpdate = async (e: React.MouseEvent, script: LabScript, newStatus: LabScript['status']) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Script status changed to ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getStatusButtons = (script: LabScript) => {
    const buttonClass = "p-2 rounded-full transition-all duration-300 hover:scale-110";
    
    switch (script.status) {
      case 'pending':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, script, 'in_progress')}
            className={`${buttonClass} hover:bg-blue-50 text-blue-600`}
          >
            <Play className="h-4 w-4" />
          </Button>
        );
      case 'in_progress':
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleStatusUpdate(e, script, 'paused')}
              className={`${buttonClass} hover:bg-orange-50 text-orange-600`}
            >
              <Pause className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleStatusUpdate(e, script, 'completed')}
              className={`${buttonClass} hover:bg-green-50 text-green-600`}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'paused':
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleStatusUpdate(e, script, 'in_progress')}
              className={`${buttonClass} hover:bg-blue-50 text-blue-600`}
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleStatusUpdate(e, script, 'hold')}
              className={`${buttonClass} hover:bg-red-50 text-red-600`}
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'hold':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, script, 'in_progress')}
            className={`${buttonClass} hover:bg-blue-50 text-blue-600`}
          >
            <Play className="h-4 w-4" />
          </Button>
        );
      case 'completed':
        return null;
      default:
        return null;
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
          <TableHead>Treatments</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Update Status</TableHead>
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
              className="hover:bg-gray-50 transition-colors duration-200"
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
                <div className="flex items-center justify-start gap-2">
                  {getStatusButtons(script)}
                </div>
              </TableCell>
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