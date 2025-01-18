import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle, CheckCircle, Edit } from "lucide-react";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mapDatabaseLabScript } from "@/types/labScript";
import { HoldReasonDialog } from "../lab-script-details/HoldReasonDialog";

interface StatusButtonsProps {
  script: LabScript;
}

export const StatusButtons = ({ script }: StatusButtonsProps) => {
  const { toast } = useToast();
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [selectedHoldReason, setSelectedHoldReason] = useState("");
  const buttonClass = "p-2 rounded-full transition-all duration-500 ease-in-out transform hover:scale-110";

  // Add real-time query for script status with proper type handling
  const { data: currentScript } = useQuery({
    queryKey: ['scriptStatus', script.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('id', script.id)
        .single();

      if (error) throw error;
      
      // Ensure status is a valid LabScriptStatus before mapping
      const validStatus = data.status as LabScriptStatus;
      return mapDatabaseLabScript({ ...data, status: validStatus });
    },
    refetchInterval: 1,
    initialData: script,
  });

  const handleStatusUpdate = async (e: React.MouseEvent, newStatus: LabScript['status'], holdReason?: string) => {
    e.stopPropagation();
    try {
      const updateData: any = { status: newStatus };
      if (holdReason) {
        updateData.hold_reason = holdReason;
      }

      const { error } = await supabase
        .from('lab_scripts')
        .update(updateData)
        .eq('id', script.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Script status changed to ${newStatus.replace('_', ' ')}`
      });
      
      setShowStatusOptions(false);
      setShowHoldDialog(false);
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

  const status = currentScript?.status || script.status;

  switch (status) {
    case 'pending':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300 animate-fade-in`}
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
          >
            <Pause className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHoldDialog(true)}
            className={`${buttonClass} hover:bg-red-50 text-red-600 transition-all duration-300`}
          >
            <StopCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'completed')}
            className={`${buttonClass} hover:bg-green-50 text-green-600 transition-all duration-300`}
          >
            <CheckCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <HoldReasonDialog
            open={showHoldDialog}
            onOpenChange={setShowHoldDialog}
            selectedReason={selectedHoldReason}
            onReasonChange={setSelectedHoldReason}
            onConfirm={handleHoldConfirm}
          />
        </div>
      );
    case 'paused':
      return (
        <div className="flex gap-2 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleStatusUpdate(e, 'in_progress')}
            className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300`}
          >
            <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHoldDialog(true)}
            className={`${buttonClass} hover:bg-red-50 text-red-600 transition-all duration-300`}
          >
            <StopCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <HoldReasonDialog
            open={showHoldDialog}
            onOpenChange={setShowHoldDialog}
            selectedReason={selectedHoldReason}
            onReasonChange={setSelectedHoldReason}
            onConfirm={handleHoldConfirm}
          />
        </div>
      );
    case 'hold':
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => handleStatusUpdate(e, 'in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 transition-all duration-300 animate-fade-in`}
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
          >
            <Play className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHoldDialog(true)}
            className={`${buttonClass} hover:bg-red-50 text-red-600 transition-all duration-300`}
          >
            <StopCircle className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <HoldReasonDialog
            open={showHoldDialog}
            onOpenChange={setShowHoldDialog}
            selectedReason={selectedHoldReason}
            onReasonChange={setSelectedHoldReason}
            onConfirm={handleHoldConfirm}
          />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEditClick}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 group transition-all duration-300 animate-fade-in`}
        >
          <Edit className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        </Button>
      );
    default:
      return null;
  }
};