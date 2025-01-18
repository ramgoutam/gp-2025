import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, CheckCircle, Edit } from "lucide-react";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mapDatabaseLabScript } from "@/types/labScript";
import { HoldReasonDialog } from "../lab-script-details/HoldReasonDialog";
import { useLabScriptStatus } from "@/hooks/useLabScriptStatus";

interface StatusButtonsProps {
  script: LabScript;
}

export const StatusButtons = ({ script }: StatusButtonsProps) => {
  const { toast } = useToast();
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [selectedHoldReason, setSelectedHoldReason] = useState("");
  const { updateStatus, isUpdating } = useLabScriptStatus();
  const buttonClass = "p-2 rounded-full transition-all duration-500 ease-in-out transform hover:scale-110";

  // Add query to check user role
  const { data: userRole } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      console.log("Fetching user role");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      console.log("User role:", roles?.role);
      return roles?.role;
    }
  });

  // Check if user has permission to update status
  const canUpdateStatus = userRole === 'ADMIN' || userRole === 'LAB_MANAGER' || userRole === 'LAB_STAFF';

  // If user doesn't have permission, don't render anything
  if (!canUpdateStatus) {
    return null;
  }

  const { data: currentScript } = useQuery({
    queryKey: ['scriptStatus', script.id],
    queryFn: async () => {
      console.log("Fetching status for script:", script.id);
      try {
        const { data, error } = await supabase
          .from('lab_scripts')
          .select('*')
          .eq('id', script.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching script status:", error);
          throw error;
        }

        if (!data) {
          console.log("No data found for script status:", script.id);
          return script;
        }

        return mapDatabaseLabScript(data);
      } catch (error) {
        console.error("Unexpected error fetching script status:", error);
        return script;
      }
    },
    refetchInterval: 1000,
    initialData: script,
  });

  const status = currentScript?.status || script.status;

  const handleStatusUpdate = async (e: React.MouseEvent, newStatus: LabScriptStatus, holdReason?: string) => {
    e.stopPropagation();
    try {
      const success = await updateStatus(script, newStatus, holdReason);
      
      if (success) {
        toast({
          title: "Status Updated",
          description: `Script status changed to ${newStatus.replace('_', ' ')}`
        });
        
        setShowStatusOptions(false);
        setShowHoldDialog(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleHoldConfirm = (reason: string, additionalInfo?: string) => {
    const holdReason = additionalInfo ? `${reason}: ${additionalInfo}` : reason;
    handleStatusUpdate(new MouseEvent('click') as any, 'hold', holdReason);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStatusOptions(true);
  };

  switch (status) {
    case 'pending':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300 animate-fade-in`}
          disabled={isUpdating}
        >
          <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        </Button>
      );
    case 'in_progress':
      return (
        <div className="flex gap-2 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'paused')}
            className={`${buttonClass} hover:bg-orange-50 text-orange-600 transition-all duration-300`}
            disabled={isUpdating}
          >
            <Pause className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHoldDialog(true)}
            className={`${buttonClass} hover:bg-red-50 text-red-600 transition-all duration-300`}
            disabled={isUpdating}
          >
            <StopCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'completed')}
            className={`${buttonClass} hover:bg-green-50 text-green-600 transition-all duration-300`}
            disabled={isUpdating}
          >
            <CheckCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <HoldReasonDialog
            open={showHoldDialog}
            onOpenChange={setShowHoldDialog}
            selectedReason={selectedHoldReason}
            onReasonChange={setSelectedHoldReason}
            onConfirm={(reason) => {
              if (reason) {
                handleStatusUpdate(new MouseEvent('click') as any, 'hold', reason);
              }
            }}
          />
        </div>
      );
    case 'paused':
    case 'hold':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300 animate-fade-in`}
          disabled={isUpdating}
        >
          <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        </Button>
      );
    case 'completed':
      return showStatusOptions ? (
        <div className="flex gap-2 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'in_progress')}
            className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300`}
            disabled={isUpdating}
          >
            <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHoldDialog(true)}
            className={`${buttonClass} hover:bg-red-50 text-red-600 transition-all duration-300`}
            disabled={isUpdating}
          >
            <StopCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <HoldReasonDialog
            open={showHoldDialog}
            onOpenChange={setShowHoldDialog}
            selectedReason={selectedHoldReason}
            onReasonChange={setSelectedHoldReason}
            onConfirm={(reason) => {
              if (reason) {
                handleStatusUpdate(new MouseEvent('click') as any, 'hold', reason);
              }
            }}
          />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowStatusOptions(true)}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 group transition-all duration-300 animate-fade-in`}
          disabled={isUpdating}
        >
          <Edit className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        </Button>
      );
    default:
      return null;
  }
};
