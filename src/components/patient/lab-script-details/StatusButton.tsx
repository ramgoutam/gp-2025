import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, StopCircle, PlayCircle, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDatabaseLabScript } from "@/types/labScript";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StatusButtonProps {
  script: LabScript;
  onStatusChange: (newStatus: LabScript['status']) => void;
}

const HOLD_REASONS = [
  "Hold for Approval",
  "Hold for Insufficient Data",
  "Hold for Insufficient Details",
  "Hold for Other reason"
];

export const StatusButton = ({ script, onStatusChange }: StatusButtonProps) => {
  const { toast } = useToast();
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [designLink, setDesignLink] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  // Add real-time query for script status with proper type handling and error management
  const { data: currentScript } = useQuery({
    queryKey: ['scriptStatus', script.id],
    queryFn: async () => {
      console.log("Fetching status for script:", script.id);
      try {
        const { data, error } = await supabase
          .from('lab_scripts')
          .select('*')
          .eq('id', script.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching script status:", error);
          throw error;
        }

        if (!data) {
          console.log("No data found for script status:", script.id);
          return script;
        }

        const validStatus = data.status as LabScriptStatus;
        return mapDatabaseLabScript({ ...data, status: validStatus });
      } catch (error) {
        console.error("Unexpected error fetching script status:", error);
        return script;
      }
    },
    refetchInterval: 1000,
    initialData: script,
  });

  const status = currentScript?.status || script.status;

  const handleFileUpload = async () => {
    if (!files || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${script.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('lab_script_files')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          throw uploadError;
        }

        const { error: fileRecordError } = await supabase
          .from('lab_script_files')
          .insert({
            lab_script_id: script.id,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            upload_type: 'design_approval'
          });

        if (fileRecordError) {
          console.error("Error saving file record:", fileRecordError);
          throw fileRecordError;
        }
      }
    } catch (error) {
      console.error("Error in file upload:", error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);
      const updates: any = { status: newStatus };
      
      if (newStatus === 'hold' && selectedReason === 'Hold for Approval') {
        updates.design_link = designLink;
      }

      const { error } = await supabase
        .from('lab_scripts')
        .update(updates)
        .eq('id', script.id);

      if (error) {
        console.error("Error updating status:", error);
        throw error;
      }

      if (files && files.length > 0) {
        await handleFileUpload();
      }

      onStatusChange(newStatus);
      
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleHoldConfirm = () => {
    if (selectedReason) {
      handleStatusChange('hold');
      setShowHoldDialog(false);
      setSelectedReason("");
      setDesignLink("");
      setFiles(null);
    }
  };

  const buttonClass = "transition-all duration-300 transform hover:scale-105";

  switch (status) {
    case 'pending':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <Play className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-[360deg]" />
          Start Design
        </Button>
      );
    
    case 'in_progress':
      return (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('paused')}
              className={`${buttonClass} hover:bg-yellow-50 text-yellow-600 border-yellow-200 group`}
            >
              <Pause className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHoldDialog(true)}
              className={`${buttonClass} hover:bg-red-50 text-red-600 border-red-200 group`}
            >
              <StopCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Hold
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('completed')}
              className={`${buttonClass} hover:bg-green-50 text-green-600 border-green-200 group`}
            >
              <CheckCircle className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              Complete
            </Button>

            <Dialog open={showHoldDialog} onOpenChange={setShowHoldDialog}>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Select Hold Reason</DialogTitle>
                </DialogHeader>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[200]">
                    {HOLD_REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason} className="hover:bg-gray-100">
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedReason === 'Hold for Approval' && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter design weblink"
                      value={designLink}
                      onChange={(e) => setDesignLink(e.target.value)}
                    />
                    <div className="space-y-2">
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => setFiles(e.target.files)}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-gray-500">Upload design pictures</p>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowHoldDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleHoldConfirm}
                    disabled={!selectedReason}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Confirm Hold
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    
    case 'paused':
    case 'hold':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-primary/5 group animate-fade-in`}
        >
          <PlayCircle className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-[360deg]" />
          Resume
        </Button>
      );
    
    case 'completed':
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange('in_progress')}
          className={`${buttonClass} hover:bg-blue-50 text-blue-600 border-blue-200 group animate-fade-in`}
        >
          <AlertCircle className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
          Edit Status
        </Button>
      );
    
    default:
      return null;
  }
};