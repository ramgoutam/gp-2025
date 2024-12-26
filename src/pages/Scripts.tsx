import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { LabScriptDetails } from "@/components/patient/LabScriptDetails";
import { supabase } from "@/integrations/supabase/client";
import { ScriptStatusCards } from "@/components/scripts/ScriptStatusCards";
import { ScriptList } from "@/components/scripts/ScriptList";
import { useScriptQuery } from "@/components/scripts/useScriptQuery";

const Scripts = () => {
  const [showNewScriptDialog, setShowNewScriptDialog] = useState(false);
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const { 
    data: labScripts = [], 
    isError,
    error,
    refetch,
    isLoading 
  } = useScriptQuery(statusFilter);

  const handleNewScriptSubmit = async (formData: LabScript) => {
    try {
      console.log("Creating new lab script:", formData);
      const { data, error } = await supabase
        .from('lab_scripts')
        .insert([{
          patient_id: formData.patientId,
          doctor_name: formData.doctorName,
          clinic_name: formData.clinicName,
          request_date: formData.requestDate,
          due_date: formData.dueDate,
          upper_treatment: formData.upperTreatment,
          lower_treatment: formData.lowerTreatment,
          upper_design_name: formData.upperDesignName,
          lower_design_name: formData.lowerDesignName,
          appliance_type: formData.applianceType,
          screw_type: formData.screwType,
          vdo_option: formData.vdoOption,
          specific_instructions: formData.specificInstructions,
        }])
        .select()
        .single();

      if (error) throw error;

      setShowNewScriptDialog(false);
      toast({
        title: "Lab Script Created",
        description: "The lab script has been successfully created.",
      });
    } catch (error) {
      console.error("Error creating lab script:", error);
      toast({
        title: "Error",
        description: "Failed to create lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScriptEdit = async (updatedScript: LabScript) => {
    try {
      console.log("Editing script:", updatedScript);
      const { error } = await supabase
        .from('lab_scripts')
        .update({
          doctor_name: updatedScript.doctorName,
          clinic_name: updatedScript.clinicName,
          request_date: updatedScript.requestDate,
          due_date: updatedScript.dueDate,
          upper_treatment: updatedScript.upperTreatment,
          lower_treatment: updatedScript.lowerTreatment,
          upper_design_name: updatedScript.upperDesignName,
          lower_design_name: updatedScript.lowerDesignName,
          appliance_type: updatedScript.applianceType,
          screw_type: updatedScript.screwType,
          vdo_option: updatedScript.vdoOption,
          specific_instructions: updatedScript.specificInstructions,
        })
        .eq('id', updatedScript.id);

      if (error) throw error;

      setSelectedScript(null);
      setIsEditing(false);
      toast({
        title: "Lab Script Updated",
        description: "The lab script has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating lab script:", error);
      toast({
        title: "Error",
        description: "Failed to update lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScriptDelete = async (scriptToDelete: LabScript) => {
    try {
      console.log("Deleting script:", scriptToDelete);
      const { error } = await supabase
        .from('lab_scripts')
        .delete()
        .eq('id', scriptToDelete.id);

      if (error) throw error;

      toast({
        title: "Lab Script Deleted",
        description: "The lab script has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting lab script:", error);
      toast({
        title: "Error",
        description: "Failed to delete lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lab Scripts</h1>
        <Button 
          onClick={() => setShowNewScriptDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Script
        </Button>
      </div>

      <ScriptStatusCards 
        onFilterChange={setStatusFilter}
        activeFilter={statusFilter}
      />

      <ScriptList
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        labScripts={labScripts}
        onRefetch={refetch}
        onScriptSelect={(script) => {
          setSelectedScript(script);
          setIsEditing(false);
        }}
        onScriptEdit={(script) => {
          setSelectedScript(script);
          setIsEditing(true);
        }}
        onScriptDelete={handleScriptDelete}
      />

      <Dialog 
        open={showNewScriptDialog} 
        onOpenChange={setShowNewScriptDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Lab Script</DialogTitle>
          </DialogHeader>
          <LabScriptForm onSubmit={handleNewScriptSubmit} />
        </DialogContent>
      </Dialog>

      <LabScriptDetails
        script={selectedScript}
        open={!!selectedScript}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedScript(null);
            setIsEditing(false);
          }
        }}
        onEdit={handleScriptEdit}
        isEditing={isEditing}
      />
    </main>
  );
};

export default Scripts;