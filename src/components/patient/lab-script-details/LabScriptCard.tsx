import React from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardActions } from "./CardActions";
import { StatusButton } from "./StatusButton";
import { LabScript } from "@/types/labScript";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LabScriptCardProps {
  script: LabScript;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (script: LabScript, newStatus: LabScript['status']) => void;
}

export const LabScriptCard = ({
  script,
  onClick,
  onEdit,
  onDelete,
  onStatusChange,
}: LabScriptCardProps) => {
  // Query for real-time script updates
  const { data: updatedScript } = useQuery({
    queryKey: ['labScript', script.id],
    queryFn: async () => {
      console.log("Fetching real-time updates for script:", script.id);
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('id', script.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching script:", error);
        return script;
      }

      return data || script;
    },
    refetchInterval: 1, // Refetch every millisecond
    initialData: script,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hold':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'in_progress':
        return 'In Progress';
      case 'paused':
        return 'Paused';
      case 'hold':
        return 'On Hold';
      case 'completed':
        return 'Completed';
      default:
        return status.replace('_', ' ');
    }
  };

  const getScriptTitle = () => {
    const upperDesign = updatedScript.upperDesignName || "Not specified";
    const lowerDesign = updatedScript.lowerDesignName || "Not specified";
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{updatedScript.applianceType || "N/A"}</span>
        <span className="text-sm text-gray-500">|</span>
        <span className="text-sm text-gray-600">Upper: {upperDesign}</span>
        <span className="text-sm text-gray-500">|</span>
        <span className="text-sm text-gray-600">Lower: {lowerDesign}</span>
      </div>
    );
  };

  const handleStatusChange = (newStatus: LabScript['status']) => {
    console.log("Handling status change in LabScriptCard:", updatedScript.id, newStatus);
    onStatusChange(updatedScript, newStatus);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-gradient-to-br from-white to-purple-50/30 animate-fade-in">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {getScriptTitle()}
              <Badge 
                variant="outline" 
                className={`${getStatusColor(updatedScript.status)} px-3 py-1 uppercase text-xs font-medium transition-all duration-300`}
              >
                {getStatusText(updatedScript.status)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span>Created: {format(new Date(updatedScript.requestDate), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Due: {format(new Date(updatedScript.dueDate), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Doctor: {updatedScript.doctorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Clinic: {updatedScript.clinicName}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <CardActions
              onEdit={onEdit}
              onView={onClick}
              onDelete={onDelete}
            />
            <StatusButton 
              script={updatedScript}
              status={updatedScript.status} 
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};