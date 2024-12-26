import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptList } from "@/components/patient/LabScriptList";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScriptStatusCards } from "@/components/scripts/ScriptStatusCards";

// Move query function to a separate file to reduce complexity
const fetchLabScripts = async (statusFilter: string | null) => {
  console.log("Fetching lab scripts with filter:", statusFilter);
  let query = supabase
    .from('lab_scripts')
    .select(`
      *,
      patient:patients(first_name, last_name)
    `);

  // Handle incomplete status filter
  if (statusFilter === 'incomplete') {
    query = query.in('status', ['pending', 'in_progress', 'paused', 'hold']);
  } else if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: scripts, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching lab scripts:", error);
    throw error;
  }

  console.log("Raw database response:", scripts);

  return scripts.map(script => ({
    id: script.id,
    requestNumber: script.request_number,
    patientId: script.patient_id,
    patientFirstName: script.patient?.first_name,
    patientLastName: script.patient?.last_name,
    doctorName: script.doctor_name,
    clinicName: script.clinic_name,
    requestDate: script.request_date,
    dueDate: script.due_date,
    status: script.status as LabScript["status"],
    upperTreatment: script.upper_treatment,
    lowerTreatment: script.lower_treatment,
    upperDesignName: script.upper_design_name,
    lowerDesignName: script.lower_design_name,
    applianceType: script.appliance_type,
    screwType: script.screw_type,
    vdoOption: script.vdo_option,
    specificInstructions: script.specific_instructions,
  } as LabScript));
};

const Scripts = () => {
  const [showNewScriptDialog, setShowNewScriptDialog] = useState(false);
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: labScripts = [] } = useQuery({
    queryKey: ['labScripts', statusFilter],
    queryFn: () => fetchLabScripts(statusFilter),
    refetchInterval: 1, // Refetch every millisecond for real-time updates
  });

  // Set up real-time subscription
  React.useEffect(() => {
    console.log("Setting up real-time subscription");
    const channel = supabase
      .channel('lab-scripts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_scripts'
        },
        (payload) => {
          console.log("Lab script change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ['labScripts'] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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

      <div className="bg-white p-6 rounded-lg shadow">
        <ScrollArea className="h-[500px]">
          <LabScriptList 
            labScripts={labScripts}
            onRowClick={(script) => {
              setSelectedScript(script);
              setIsEditing(false);
            }}
            onEditClick={(script) => {
              setSelectedScript(script);
              setIsEditing(true);
            }}
            onDeleteClick={handleScriptDelete}
          />
        </ScrollArea>
      </div>

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