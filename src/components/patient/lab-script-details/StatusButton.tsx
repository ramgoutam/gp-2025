import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatusButtons } from './status/StatusButtons';
import { HoldDialog } from './status/HoldDialog';

interface StatusButtonProps {
  script: any;
  onStatusChange: (newStatus: string) => void;
}

export const StatusButton = ({ script, onStatusChange }: StatusButtonProps) => {
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [designLink, setDesignLink] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

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

        if (uploadError) throw uploadError;

        const { error: fileRecordError } = await supabase
          .from('lab_script_files')
          .insert({
            lab_script_id: script.id,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            upload_type: 'design_approval'
          });

        if (fileRecordError) throw fileRecordError;
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      console.log("Updating status for script:", script.id, "to:", newStatus);
      const updates: any = { status: newStatus };
      
      if (newStatus === 'hold') {
        if (selectedReason === 'Hold for Approval') {
          updates.design_link = designLink;
          await handleFileUpload();
        } else {
          updates.hold_reason = comment;
        }
      }

      const { error } = await supabase
        .from('lab_scripts')
        .update(updates)
        .eq('id', script.id);

      if (error) throw error;

      onStatusChange(newStatus);
      
      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus.replace('_', ' ')}`
      });

      // Reset state
      setShowHoldDialog(false);
      setSelectedReason("");
      setDesignLink("");
      setFiles(null);
      setComment("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <StatusButtons
        status={script.status}
        onComplete={() => handleStatusChange('completed')}
        onHold={() => setShowHoldDialog(true)}
        onResume={() => handleStatusChange('in_progress')}
        onStart={() => handleStatusChange('in_progress')}
      />

      <HoldDialog
        showDialog={showHoldDialog}
        onClose={() => setShowHoldDialog(false)}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
        designLink={designLink}
        onDesignLinkChange={setDesignLink}
        files={files}
        onFilesChange={setFiles}
        comment={comment}
        onCommentChange={setComment}
        onConfirm={() => handleStatusChange('hold')}
      />
    </>
  );
};