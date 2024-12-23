import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Stethoscope, Calendar, User, FileCheck, ArrowRight, Clock, Trash2, ChevronDown, Plus } from "lucide-react";
import { LabScript } from "../LabScriptsTab";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LabScriptCardProps {
  script: LabScript;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange?: (script: LabScript, newStatus: LabScript['status']) => void;
}

export const LabScriptCard = ({ 
  script, 
  onClick, 
  onEdit, 
  onDelete,
  onStatusChange 
}: LabScriptCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete();
  };

  const handleStatusChange = (newStatus: string) => {
    console.log("Status change requested:", newStatus);
    if (onStatusChange) {
      onStatusChange(script, newStatus as LabScript['status']);
      toast({
        title: "Status Updated",
        description: `Lab script status changed to ${newStatus.replace('_', ' ')}`
      });
    }
  };

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-white animate-fade-in">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h4 className="font-semibold text-lg text-gray-900">Lab Request #{script.requestNumber}</h4>
                <Badge variant="outline" className={`${getStatusColor(script.status)} px-3 py-1 uppercase text-xs font-medium`}>
                  {script.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary/60" />
                  <span>Created: {format(new Date(script.requestDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary/60" />
                  <span>Dr. {script.doctorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary/60" />
                  <span>Due: {format(new Date(script.dueDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-primary/60" />
                  <span>Status: {script.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 hover:bg-destructive/5 group-hover:border-destructive/30 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
              >
                <Settings className="h-4 w-4" />
                Edit
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClick}
                className="flex items-center gap-2 hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300"
              >
                <Stethoscope className="h-4 w-4" />
                View Details
                <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
            <Select defaultValue={script.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <span>Change Status</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this lab script?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lab script
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};