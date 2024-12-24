import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScript } from "@/types/labScript";
import { FormFields } from "./clinical-info/FormFields";
import { useClinicalInfo } from "./clinical-info/useClinicalInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClinicalInfoFormProps {
  onClose: () => void;
  script: LabScript;
  onSave: (updatedScript: LabScript) => void;
}

export const ClinicalInfoForm = ({ onClose, script, onSave }: ClinicalInfoFormProps) => {
  const { formData, handleFieldChange, handleSubmit: submitForm, isSubmitting } = useClinicalInfo(script, onSave, onClose);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitForm(e);
      
      // Update report card status with updated_at timestamp
      const { error: updateError } = await supabase
        .from('report_cards')
        .update({ 
          clinical_info_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('lab_script_id', script.id);

      if (updateError) {
        console.error('Error updating report card status:', updateError);
        toast({
          title: "Error",
          description: "Failed to update clinical info status",
          variant: "destructive"
        });
        return;
      }

    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  if (isSubmitting) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ScrollArea className="h-full pr-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormFields 
            formData={formData}
            onFieldChange={handleFieldChange}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {script.clinicalInfo ? 'Update Clinical Info' : 'Save Clinical Info'}
            </Button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
};