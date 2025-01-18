import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock } from "lucide-react";
import { LabScriptStatus } from "@/types/labScript";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StatusDetails {
  status: LabScriptStatus;
  status_changed_at: string | null;
  status_changed_by: string | null;
  status_notes: string | null;
  status_changed_by_user?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  created_at: string;
  manufacturing_logs?: {
    manufacturing_status: string;
    manufacturing_started_at: string | null;
    sintering_status: string;
    sintering_started_at: string | null;
    miyo_status: string;
    miyo_started_at: string | null;
    inspection_status: string;
    inspection_started_at: string | null;
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
          created_at,
          status_changed_by_user:user_roles!left(
            first_name,
            last_name
          ),
          manufacturing_logs!left(
            manufacturing_status,
            manufacturing_started_at,
            sintering_status,
            sintering_started_at,
            miyo_status,
            miyo_started_at,
            inspection_status,
            inspection_started_at
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'on_hold':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderTimelineItem = (date: string | null, title: string, description: string | null, status?: string) => {
    return (
      <div className="flex gap-4 mb-4">
        <div className="flex-shrink-0 mt-1">
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-grow">
          <p className="text-sm text-gray-500">{formatDate(date)}</p>
          <h4 className="font-medium text-gray-900">{title}</h4>
          {description && <p className={`text-sm ${status ? getStatusColor(status) : 'text-gray-600'}`}>{description}</p>}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !statusDetails ? (
          <div className="text-center p-4 text-gray-500">
            No status details available
          </div>
        ) : (
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Lab Script Creation */}
              {renderTimelineItem(
                statusDetails.created_at,
                "Lab Script Created",
                "New lab script was created"
              )}

              {/* Status Changes */}
              {statusDetails.status_changed_at && renderTimelineItem(
                statusDetails.status_changed_at,
                "Status Updated",
                `Status changed to ${statusDetails.status}${
                  statusDetails.status_changed_by_user 
                    ? ` by ${statusDetails.status_changed_by_user.first_name} ${statusDetails.status_changed_by_user.last_name}`
                    : ''
                }`,
                statusDetails.status
              )}

              {/* Manufacturing Logs */}
              {statusDetails.manufacturing_logs?.manufacturing_started_at && renderTimelineItem(
                statusDetails.manufacturing_logs.manufacturing_started_at,
                "Manufacturing Started",
                `Status: ${statusDetails.manufacturing_logs.manufacturing_status}`,
                statusDetails.manufacturing_logs.manufacturing_status
              )}

              {statusDetails.manufacturing_logs?.sintering_started_at && renderTimelineItem(
                statusDetails.manufacturing_logs.sintering_started_at,
                "Sintering Started",
                `Status: ${statusDetails.manufacturing_logs.sintering_status}`,
                statusDetails.manufacturing_logs.sintering_status
              )}

              {statusDetails.manufacturing_logs?.miyo_started_at && renderTimelineItem(
                statusDetails.manufacturing_logs.miyo_started_at,
                "Miyo Process Started",
                `Status: ${statusDetails.manufacturing_logs.miyo_status}`,
                statusDetails.manufacturing_logs.miyo_status
              )}

              {statusDetails.manufacturing_logs?.inspection_started_at && renderTimelineItem(
                statusDetails.manufacturing_logs.inspection_started_at,
                "Inspection Started",
                `Status: ${statusDetails.manufacturing_logs.inspection_status}`,
                statusDetails.manufacturing_logs.inspection_status
              )}

              {/* Notes */}
              {statusDetails.status_notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                  <p className="text-sm text-gray-600">{statusDetails.status_notes}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};