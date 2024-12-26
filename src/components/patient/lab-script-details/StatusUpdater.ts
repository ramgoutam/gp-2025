import { useState } from "react";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStatusUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (script: LabScript, newStatus: LabScript["status"]) => {
    if (isUpdating) {
      console.log("Status update already in progress");
      return;
    }

    setIsUpdating(true);
    console.log("Updating lab script status:", script.id, newStatus);

    try {
      const { data, error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Lab script not found");
      }

      console.log("Status updated successfully:", data);
      
      toast({
        title: "Status Updated",
        description: `Lab script status has been updated to ${newStatus}`,
      });

    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating };
};