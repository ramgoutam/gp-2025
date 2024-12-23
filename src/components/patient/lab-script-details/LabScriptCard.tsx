import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CardActions } from "./CardActions";
import { StatusButton } from "./StatusButton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { LabScript } from "../LabScriptsTab";

interface LabScriptCardProps {
  script: LabScript;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (script: LabScript, newStatus: LabScript['status']) => void;
}

export const LabScriptCard = ({ script, onClick, onEdit, onDelete, onStatusChange }: LabScriptCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Design Pending';
      case 'in_progress':
        return 'Design In Progress';
      case 'completed':
        return 'Design Completed';
      default:
        return status.replace('_', ' ');
    }
  };

  const handleStatusChange = () => {
    const newStatus = script.status === 'pending' 
      ? 'in_progress' 
      : script.status === 'in_progress' 
        ? 'completed' 
        : 'completed';
    onStatusChange(script, newStatus);
  };

  const getDesignNameDisplay = (designName: string | undefined) => {
    if (!designName) return "Not specified";
    return designName;
  };

  const getScriptTitle = () => {
    const upperDesign = getDesignNameDisplay(script.upperDesignName);
    const lowerDesign = getDesignNameDisplay(script.lowerDesignName);
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{script.applianceType || "N/A"}</span>
        <span className="text-sm text-gray-500">|</span>
        <span className="text-sm text-gray-600">Upper: {upperDesign}</span>
        <span className="text-sm text-gray-500">|</span>
        <span className="text-sm text-gray-600">Lower: {lowerDesign}</span>
      </div>
    );
  };

  return (
    <>
      <Card 
        className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-white"
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {getScriptTitle()}
              <Badge 
                variant="outline" 
                className={`${getStatusColor(script.status)} px-3 py-1 uppercase text-xs font-medium`}
              >
                {getStatusText(script.status)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>Created: {format(new Date(script.requestDate), "MMM dd, yyyy")}</div>
              <div>Due: {format(new Date(script.dueDate), "MMM dd, yyyy")}</div>
              <div>Doctor: {script.doctorName}</div>
              <div>Clinic: {script.clinicName}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CardActions 
              onEdit={onEdit}
              onView={onClick}
              onDelete={() => setShowDeleteDialog(true)}
            />
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lab script.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};