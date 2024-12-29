import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface StatusButtonProps {
  script: LabScript;
  variant?: "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const StatusButton = ({ script, variant = "outline", size = "sm" }: StatusButtonProps) => {
  const { toast } = useToast();
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [designLink, setDesignLink] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);

  const { data: currentScript } = useQuery({
    queryKey: ['scriptStatus', script.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('status')
        .eq('id', script.id)
        .single();

      if (error) {
        console.error("Error fetching script status:", error);
        throw error;
      }

      return data;
    },
    refetchInterval: 1000
  });

  const holdReasons = [
    "Hold for Approval",
    "Hold for Insufficient Data",
    "Hold for Insufficient Details",
    "Hold for Other reason"
  ];

  const handleStatusChange = async (newStatus: LabScript['status']) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);
      
      // If we have files, upload them first
      if (selectedReason === "Hold for Approval" && files) {
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

          // Save file reference in lab_script_files table
          const { error: dbError } = await supabase
            .from('lab_script_files')
            .insert({
              lab_script_id: script.id,
              file_name: file.name,
              file_path: filePath,
              file_type: file.type,
              upload_type: 'hold_approval'
            });

          if (dbError) {
            console.error("Error saving file reference:", dbError);
            throw dbError;
          }
        }
      }

      const { error } = await supabase
        .from('lab_scripts')
        .update({ 
          status: newStatus,
          ...(selectedReason === "Hold for Approval" ? { design_link: designLink } : {})
        })
        .eq('id', script.id);

      if (error) {
        console.error("Error updating script status:", error);
        throw error;
      }

      toast({
        title: "Status Updated",
        description: `Lab script status updated to ${newStatus}${selectedReason ? ` (${selectedReason})` : ''}`,
      });

    } catch (error) {
      console.error("Error in handleStatusChange:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
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
      
      console.log("Script put on hold with reason:", selectedReason);
    }
  };

  switch (script.status) {
    case 'pending':
      return (
        <>
          <div className="flex gap-2">
            <Button
              variant={variant}
              size={size}
              onClick={() => handleStatusChange('in_progress')}
            >
              Start
            </Button>
            <Button
              variant={variant}
              size={size}
              onClick={() => setShowHoldDialog(true)}
            >
              Hold
            </Button>
          </div>

          <Dialog open={showHoldDialog} onOpenChange={setShowHoldDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Put Script on Hold</DialogTitle>
              </DialogHeader>
              <Select
                value={selectedReason}
                onValueChange={setSelectedReason}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reason for hold" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[200]">
                  {holdReasons.map((reason) => (
                    <SelectItem 
                      key={reason} 
                      value={reason}
                      className="hover:bg-gray-100"
                    >
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedReason === "Hold for Approval" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Design Link</label>
                    <Input
                      type="url"
                      placeholder="Enter design weblink"
                      value={designLink}
                      onChange={(e) => setDesignLink(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Attach Pictures</label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setFiles(e.target.files)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowHoldDialog(false);
                    setSelectedReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleHoldConfirm}
                  disabled={!selectedReason}
                >
                  Confirm Hold
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    case 'in_progress':
      return (
        <div className="flex gap-2">
          <Button
            variant={variant}
            size={size}
            onClick={() => handleStatusChange('completed')}
          >
            Complete
          </Button>
          <Button
            variant={variant}
            size={size}
            onClick={() => setShowHoldDialog(true)}
          >
            Hold
          </Button>
        </div>
      );
    case 'hold':
      return (
        <Button
          variant={variant}
          size={size}
          onClick={() => handleStatusChange('in_progress')}
        >
          Resume
        </Button>
      );
    case 'completed':
      return null;
    default:
      return null;
  }
};