import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useQueueHandlers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateManufacturingLog = async (scriptId: string, updates: any) => {
    try {
      console.log("Updating manufacturing log:", { scriptId, updates });
      const { error } = await supabase
        .from('manufacturing_logs')
        .update(updates)
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      queryClient.setQueryData(['manufacturingLogs', scriptId], (oldData: any) => ({
        ...oldData,
        ...updates
      }));

      queryClient.invalidateQueries({ queryKey: ['manufacturingData'] });
      queryClient.invalidateQueries({ queryKey: ['manufacturingStatusCounts'] });

      return true;
    } catch (error) {
      console.error('Error updating manufacturing log:', error);
      toast({
        title: "Error",
        description: "Failed to update manufacturing status",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleStartManufacturing = async (scriptId: string) => {
    console.log("Starting manufacturing for script:", scriptId);
    const success = await updateManufacturingLog(scriptId, {
      manufacturing_status: 'in_progress',
      manufacturing_started_at: new Date().toISOString()
    });

    if (success) {
      toast({
        title: "Manufacturing Started",
        description: "The manufacturing process has been initiated."
      });
    }
  };

  const handleCompleteManufacturing = async (scriptId: string) => {
    console.log("Completing manufacturing for script:", scriptId);
    const success = await updateManufacturingLog(scriptId, {
      manufacturing_status: 'completed',
      manufacturing_completed_at: new Date().toISOString()
    });

    if (success) {
      toast({
        title: "Manufacturing Completed",
        description: "The manufacturing process has been completed."
      });
    }
  };

  const handleHoldManufacturing = async (scriptId: string, reason?: string) => {
    console.log("Putting manufacturing on hold for script:", scriptId);
    const success = await updateManufacturingLog(scriptId, {
      manufacturing_status: 'on_hold',
      manufacturing_hold_at: new Date().toISOString(),
      manufacturing_hold_reason: reason
    });

    if (success) {
      toast({
        title: "Manufacturing On Hold",
        description: "The manufacturing process has been put on hold."
      });
    }
  };

  const handleResumeManufacturing = async (scriptId: string) => {
    console.log("Resuming manufacturing for script:", scriptId);
    const success = await updateManufacturingLog(scriptId, {
      manufacturing_status: 'in_progress',
      manufacturing_hold_at: null,
      manufacturing_hold_reason: null
    });

    if (success) {
      toast({
        title: "Manufacturing Resumed",
        description: "The manufacturing process has been resumed."
      });
    }
  };

  const handleStartSintering = async (scriptId: string) => {
    const success = await updateManufacturingLog(scriptId, {
      sintering_status: 'in_progress',
      sintering_started_at: new Date().toISOString()
    });

    if (success) {
      toast({
        title: "Sintering Started",
        description: "The sintering process has been initiated."
      });
    }
  };

  const handleCompleteSintering = async (scriptId: string) => {
    const success = await updateManufacturingLog(scriptId, {
      sintering_status: 'completed',
      sintering_completed_at: new Date().toISOString()
    });

    if (success) {
      toast({
        title: "Sintering Completed",
        description: "The sintering process has been completed."
      });
    }
  };

  const handleStartMiyo = async (scriptId: string) => {
    const success = await updateManufacturingLog(scriptId, {
      miyo_status: 'in_progress',
      miyo_started_at: new Date().toISOString()
    });

    if (success) {
      toast({
        title: "Miyo Started",
        description: "The Miyo process has been initiated."
      });
    }
  };

  const handleCompleteMiyo = async (scriptId: string) => {
    const success = await updateManufacturingLog(scriptId, {
      miyo_status: 'completed',
      miyo_completed_at: new Date().toISOString()
    });

    if (success) {
      toast({
        title: "Miyo Completed",
        description: "The Miyo process has been completed."
      });
    }
  };

  const handleStartInspection = async (scriptId: string) => {
    const success = await updateManufacturingLog(scriptId, {
      inspection_status: 'in_progress',
      inspection_started_at: new Date().toISOString()
    });

    if (success) {
      toast({
        title: "Inspection Started",
        description: "The inspection process has been initiated."
      });
    }
  };

  const handleCompleteInspection = async (scriptId: string) => {
    const success = await updateManufacturingLog(scriptId, {
      inspection_status: 'completed',
      inspection_completed_at: new Date().toISOString()
    });

    if (success) {
      toast({
        title: "Inspection Completed",
        description: "The inspection process has been completed."
      });
    }
  };

  return {
    handleStartManufacturing,
    handleCompleteManufacturing,
    handleHoldManufacturing,
    handleResumeManufacturing,
    handleStartSintering,
    handleCompleteSintering,
    handleStartMiyo,
    handleCompleteMiyo,
    handleStartInspection,
    handleCompleteInspection
  };
};