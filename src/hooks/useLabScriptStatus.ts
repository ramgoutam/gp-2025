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
      // First get the current user's role ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { data: userRole, error: userRoleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userRoleError) {
        console.error("Error fetching user role:", userRoleError);
        throw userRoleError;
      }

      // Update the lab script with the user's role ID
      const updateData: any = { 
        status: newStatus,
        status_changed_by: userRole?.id || null,
        hold_reason: holdReason,
        status_notes: `Status changed to ${newStatus}${holdReason ? `: ${holdReason}` : ''}`
      };

      const { data, error } = await supabase
        .from('lab_scripts')
        .update(updateData)
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