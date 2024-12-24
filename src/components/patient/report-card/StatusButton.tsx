import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";

interface StatusButtonProps {
  status: LabScript['status'];
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ status, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'hold':
        return <StopCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusButtons = () => {
    switch (status) {
      case 'pending':
        return [
          <Button
            key="start"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('in_progress');
              toast({
                title: "Status Updated",
                description: "Design started"
              });
            }}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <Play className="h-4 w-4 text-primary" />
            Start Design
          </Button>
        ];
      
      case 'in_progress':
        return [
          <Button
            key="pause"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('paused');
              toast({
                title: "Status Updated",
                description: "Design paused"
              });
            }}
            className="flex items-center gap-2 hover:bg-yellow-50 text-yellow-600 border-yellow-200 mr-2"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>,
          <Button
            key="complete"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('completed');
              toast({
                title: "Status Updated",
                description: "Design completed"
              });
            }}
            className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200"
          >
            <CheckCircle className="h-4 w-4" />
            Complete
          </Button>
        ];
      
      case 'paused':
        return [
          <Button
            key="resume"
            variant="outline"
            size="sm"
            onClick={() => {
              onStatusChange('in_progress');
              toast({
                title: "Status Updated",
                description: "Design resumed"
              });
            }}
            className="flex items-center gap-2 hover:bg-primary/5"
          >
            <PlayCircle className="h-4 w-4 text-primary" />
            Resume
          </Button>
        ];

      case 'completed':
        return null;
      
      default:
        return [
          <Button
            key="default"
            variant="outline"
            size="sm"
            disabled
            className="flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Pending
          </Button>
        ];
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {getStatusButtons()}
    </div>
  );
};