import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { LabScriptContent } from "./lab-script-details/LabScriptContent";
import { LabScriptForm } from "@/components/LabScriptForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface LabScriptDetailsProps {
  script: LabScript | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (updatedScript: LabScript) => void;
  isEditing?: boolean;
}

export const LabScriptDetails = ({
  script,
  open,
  onOpenChange,
  onEdit,
  isEditing = false,
}: LabScriptDetailsProps) => {
  const [currentScript, setCurrentScript] = useState<LabScript | null>(script);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestScript = async () => {
      if (!script?.id || !open) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching latest script data:", script.id);
        const { data, error } = await supabase
          .from('lab_scripts')
          .select(`
            *,
            patient:patients(first_name, last_name)
          `)
          .eq('id', script.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching script:", error);
          throw error;
        }

        if (!data) {
          console.log("No script found with ID:", script.id);
          setError("Lab script not found");
          return;
        }

        console.log("Found script data:", data);
        // Ensure status is properly typed as LabScriptStatus
        const status = data.status as LabScriptStatus;
        if (!isValidLabScriptStatus(status)) {
          throw new Error(`Invalid status: ${status}`);
        }

        setCurrentScript({
          ...script,
          ...data,
          status, // Use the validated status
          patientFirstName: data.patient?.first_name,
          patientLastName: data.patient?.last_name
        });
      } catch (error) {
        console.error("Error in fetchLatestScript:", error);
        setError("Failed to load lab script details");
        toast({
          title: "Error",
          description: "Failed to load lab script details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestScript();
  }, [script?.id, open]);

  const handleEdit = (updatedScript: LabScript) => {
    console.log("Handling script edit:", updatedScript);
    setCurrentScript(updatedScript);
    if (onEdit) {
      onEdit(updatedScript);
    }
  };

  // Helper function to validate LabScriptStatus
  const isValidLabScriptStatus = (status: string): status is LabScriptStatus => {
    const validStatuses: LabScriptStatus[] = [
      "pending",
      "processing",
      "in_progress",
      "paused",
      "hold",
      "completed"
    ];
    return validStatuses.includes(status as LabScriptStatus);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center p-8 text-gray-500">
            <p>{error}</p>
          </div>
        ) : isEditing ? (
          <LabScriptForm
            initialData={currentScript || undefined}
            onSubmit={handleEdit}
            patientId={currentScript?.patientId}
          />
        ) : currentScript ? (
          <LabScriptContent script={currentScript} handlePreview={() => {}} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};