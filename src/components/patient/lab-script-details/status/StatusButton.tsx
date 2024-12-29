import React from "react";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { PendingAction } from "./PendingAction";
import { InProgressActions } from "./InProgressActions";
import { PausedAction } from "./PausedAction";
import { CompletedAction } from "./CompletedAction";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScriptStatus) => void;
  onDesignInfo?: () => void;
  isUpdating?: boolean;
}

export const StatusButton = ({ 
  script, 
  onStatusChange, 
  onDesignInfo,
  isUpdating = false 
}: StatusButtonProps) => {
  const status = script?.status || 'pending';

  switch (status) {
    case 'pending':
      return <PendingAction onStatusChange={onStatusChange} isUpdating={isUpdating} />;
    
    case 'in_progress':
      return (
        <InProgressActions 
          onStatusChange={onStatusChange}
          onDesignInfo={onDesignInfo || (() => {})}
          isUpdating={isUpdating}
        />
      );
    
    case 'paused':
    case 'hold':
      return <PausedAction onStatusChange={onStatusChange} isUpdating={isUpdating} />;
    
    case 'completed':
      return <CompletedAction onStatusChange={onStatusChange} isUpdating={isUpdating} />;
    
    default:
      return null;
  }
};