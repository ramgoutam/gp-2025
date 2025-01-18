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
      // First get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      console.log("Current user:", user.id);

      // Get user role record
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userRoleError) {
        console.error("Error fetching user role:", userRoleError);
        throw userRoleError;
      }

      if (!userRoleData) {
        console.log("No user role found, proceeding without status_changed_by");
      }

      console.log("User role data:", userRoleData);

      // Update the lab script
      const updateData: any = { 
        status: newStatus,
        status_changed_by: userRoleData?.id || null,
        hold_reason: holdReason || null,
        status_notes: `Status changed to ${newStatus}${holdReason ? `: ${holdReason}` : ''}`
      };

      console.log("Updating lab script with data:", updateData);
      
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
      toast({
        title: "Status Updated",
        description: `Lab script status changed to ${newStatus}`,
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