import React from "react";
import { LabScript } from "@/types/labScript";
import { InProgressActions } from "./InProgressActions";
import { PendingAction } from "./PendingAction";
import { PausedAction } from "./PausedAction";
import { CompletedAction } from "./CompletedAction";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
  onDesignInfo?: () => void;
}

export const StatusButton = ({ script, onStatusChange, onDesignInfo }: StatusButtonProps) => {
  const status = script?.status || 'pending';

  switch (status) {
    case 'pending':
      return <PendingAction onStatusChange={onStatusChange} />;
    
    case 'in_progress':
      return (
        <InProgressActions 
          script={script}
          onStatusChange={onStatusChange}
          onDesignInfo={onDesignInfo}
        />
      );
    
    case 'paused':
    case 'hold':
      return <PausedAction onStatusChange={onStatusChange} />;
    
    case 'completed':
      return <CompletedAction onStatusChange={onStatusChange} />;
    
    default:
      return null;
  }
};