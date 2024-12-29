import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

export const StatusButton = ({ script, onStatusChange }: StatusButtonProps) => {
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [holdReason, setHoldReason] = useState("");
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: LabScript['status'], reason?: string) => {
    try {
      console.log("Updating status to:", newStatus, "with reason:", reason);
      const updates: any = { status: newStatus };
      
      if (reason) {
        updates.hold_reason = reason;
      }

      const { error } = await supabase
        .from('lab_scripts')
        .update(updates)
        .eq('id', script.id);

      if (error) throw error;

      onStatusChange(newStatus);
      
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus.replace('_', ' ')}`
      });

      setShowHoldDialog(false);
      setHoldReason("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  if (script.status === 'hold') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusChange('in_progress')}
        className="flex items-center gap-2 hover:bg-primary/5"
      >
        <PlayCircle className="h-4 w-4 text-primary" />
        Resume
      </Button>
    );
  }

  if (script.status === 'in_progress') {
    return (
      <div className="flex flex-col gap-2">
        {showHoldDialog ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value)}
              placeholder="Enter reason for hold..."
              className="flex-1 px-3 py-1 border rounded"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('hold', holdReason)}
              disabled={!holdReason.trim()}
              className="hover:bg-yellow-50 text-yellow-600 border-yellow-200"
            >
              Confirm Hold
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('completed')}
              className="flex items-center gap-2 hover:bg-green-50 text-green-600 border-green-200"
            >
              <CheckCircle className="h-4 w-4" />
              Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHoldDialog(true)}
              className="flex items-center gap-2 hover:bg-yellow-50 text-yellow-600 border-yellow-200"
            >
              <Pause className="h-4 w-4" />
              Hold
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
};