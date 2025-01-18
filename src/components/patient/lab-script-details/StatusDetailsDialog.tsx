import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface StatusDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptId: string;
}

interface StatusDetails {
  status: string;
  status_changed_at: string;
  status_notes: string | null;
  status_changed_by: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export const StatusDetailsDialog = ({
  open,
  onOpenChange,
  scriptId,
}: StatusDetailsDialogProps) => {
  const { data: statusDetails, isLoading } = useQuery<StatusDetails>({
    queryKey: ['labScriptStatusDetails', scriptId],
    queryFn: async () => {
      console.log("Fetching status details for script:", scriptId);
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          status,
          status_changed_at,
          status_changed_by,
          status_notes,
          status_changed_by:user_roles!left(
            first_name,
            last_name
          )
        `)
        .eq('id', scriptId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching status details:", error);
        throw error;
      }

      return data;
    },
    enabled: open,
  });

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Status Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : statusDetails ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Current Status</h3>
              <p className="text-sm">{statusDetails.status}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Last Updated</h3>
              <p className="text-sm">{formatDate(statusDetails.status_changed_at)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Updated By</h3>
              <p className="text-sm">
                {statusDetails.status_changed_by?.first_name} {statusDetails.status_changed_by?.last_name}
              </p>
            </div>
            {statusDetails.status_notes && (
              <div className="space-y-2">
                <h3 className="font-medium">Notes</h3>
                <p className="text-sm">{statusDetails.status_notes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">No status details available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};