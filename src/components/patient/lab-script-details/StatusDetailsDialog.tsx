import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { LabScriptStatus } from "@/types/labScript";

interface StatusDetails {
  status: LabScriptStatus;
  status_changed_at: string | null;
  status_changed_by: string | null;
  status_notes: string | null;
  status_changed_by_user?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface StatusDetailsDialogProps {
  scriptId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StatusDetailsDialog = ({
  scriptId,
  open,
  onOpenChange,
}: StatusDetailsDialogProps) => {
  const { data: statusDetails, isLoading } = useQuery<StatusDetails>({
    queryKey: ['statusDetails', scriptId],
    queryFn: async () => {
      console.log("Fetching status details for script:", scriptId);
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          status,
          status_changed_at,
          status_changed_by,
          status_notes,
          status_changed_by_user:user_roles!left(
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

      if (!data) {
        console.log("No status details found for script:", scriptId);
        return null;
      }

      console.log("Found status details:", data);
      return data as StatusDetails;
    },
    enabled: open && !!scriptId
  });

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy HH:mm:ss");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !statusDetails ? (
          <div className="text-center p-4 text-gray-500">
            No status details available
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Current Status</h3>
              <p className="text-gray-600">{statusDetails.status}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Last Updated</h3>
              <p className="text-gray-600">
                {formatDate(statusDetails.status_changed_at)}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Updated By</h3>
              <p className="text-gray-600">
                {statusDetails.status_changed_by_user ? (
                  `${statusDetails.status_changed_by_user.first_name || ''} ${statusDetails.status_changed_by_user.last_name || ''}`.trim() || 'N/A'
                ) : (
                  'N/A'
                )}
              </p>
            </div>
            {statusDetails.status_notes && (
              <div>
                <h3 className="font-medium text-gray-900">Notes</h3>
                <p className="text-gray-600">{statusDetails.status_notes}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};