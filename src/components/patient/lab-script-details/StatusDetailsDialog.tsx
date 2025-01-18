import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatusDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptId: string;
}

interface StatusDetails {
  status: string;
  status_changed_at: string | null;
  status_changed_by: string | null;
  status_notes: string | null;
  user_roles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export const StatusDetailsDialog = ({
  open,
  onOpenChange,
  scriptId
}: StatusDetailsProps) => {
  const { data: statusDetails } = useQuery<StatusDetails | null>({
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
          user_roles:user_roles(
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
    enabled: open && !!scriptId,
    retry: 1
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Status Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="font-medium">{statusDetails?.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {formatDate(statusDetails?.status_changed_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updated By</p>
                  <p className="font-medium">
                    {statusDetails?.user_roles ? 
                      `${statusDetails.user_roles.first_name || ''} ${statusDetails.user_roles.last_name || ''}`.trim() || 'N/A'
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{statusDetails?.status_notes || 'No notes available'}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};