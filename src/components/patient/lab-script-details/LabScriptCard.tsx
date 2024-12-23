import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileCheck, Clock } from "lucide-react";
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
import { useState } from "react";
import { CardActions } from "./CardActions";
import { StatusButton } from "./StatusButton";

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

  const handleStatusChange = () => {
    if (!onStatusChange) return;
    
    const newStatus = script.status === 'pending' ? 'in_progress' : 'completed';
    onStatusChange(script, newStatus);
  };

  const getDesignNameDisplay = () => {
    const parts = [];
    
    // Add appliance type
    parts.push(
      <span key="appliance" className="text-lg font-semibold">
        {script.applianceType || 'N/A'}
      </span>
    );

    // Add separator and upper design name if exists
    if (script.upperDesignName) {
      parts.push(
        <span key="separator1" className="text-gray-400 mx-2">|</span>,
        <span key="upper" className="text-sm text-gray-600">
          {script.upperDesignName}
        </span>
      );
    }

    // Add separator and lower design name if exists
    if (script.lowerDesignName) {
      parts.push(
        <span key="separator2" className="text-gray-400 mx-2">|</span>,
        <span key="lower" className="text-sm text-gray-600">
          {script.lowerDesignName}
        </span>
      );
    }

    return parts;
  };

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-white animate-fade-in">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 flex-wrap">
                  {getDesignNameDisplay()}
                </div>
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
            <CardActions
              onEdit={onEdit}
              onView={onClick}
              onDelete={() => setShowDeleteDialog(true)}
            />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <StatusButton
              status={script.status}
              onStatusChange={handleStatusChange}
            />
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