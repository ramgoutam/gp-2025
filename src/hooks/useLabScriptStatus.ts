import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";

export const useLabScriptStatus = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (script: LabScript, newStatus: LabScript['status'], holdReason?: string) => {
    if (isUpdating || !script?.id) {
      console.log("Cannot update status: either already updating or missing script ID");
      return false;
    }
    
    setIsUpdating(true);
    console.log("Updating lab script status:", script.id, newStatus, holdReason);

    try {
      const { data, error } = await supabase
        .from('lab_scripts')
        .update({ 
          status: newStatus,
          hold_reason: holdReason 
        })
        .eq('id', script.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating status:", error);
        throw error;
      }

      console.log("Status updated successfully:", data);
      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating };
};