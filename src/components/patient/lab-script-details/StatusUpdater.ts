import { useState } from "react";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStatusUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (script: LabScript, newStatus: LabScript["status"]): Promise<boolean> => {
    if (isUpdating || !script?.id) {
      console.log("Cannot update status: either already updating or missing script ID");
      return false;
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
        console.error("Error updating status:", error);
        throw error;
      }

      console.log("Status updated successfully:", data);
      toast({
        title: "Status Updated",
        description: `Lab script status changed to ${newStatus}`
      });

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