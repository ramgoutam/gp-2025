import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabScript, LabScriptStatus } from "@/types/labScript";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptList } from "@/components/patient/LabScriptList";
import { ScriptStatusCards } from "@/components/scripts/ScriptStatusCards";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const ScriptsContent = ({
  onScriptSelect,
  onScriptEdit,
  onScriptDelete,
}: {
  onScriptSelect: (script: LabScript) => void;
  onScriptEdit: (script: LabScript) => void;
  onScriptDelete: (script: LabScript) => void;
}) => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: labScripts = [], isLoading, error } = useQuery({
    queryKey: ['labScripts', statusFilter],
    queryFn: async () => {
      console.log("Fetching lab scripts with filter:", statusFilter);
      try {
        let query = supabase
          .from('lab_scripts')
          .select(`
            *,
            patient:patients(
              first_name,
              last_name
            )
          `);

        if (statusFilter === 'incomplete') {
          query = query.neq('status', 'completed');
        } else if (statusFilter) {
          query = query.eq('status', statusFilter);
        }

        const { data: scripts, error } = await query
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching lab scripts:", error);
          throw error;
        }

        return scripts.map(script => ({
          ...script,
          status: script.status as LabScriptStatus,
          patientFirstName: script.patient?.first_name,
          patientLastName: script.patient?.last_name,
        }));
      } catch (error) {
        console.error("Failed to fetch lab scripts:", error);
        toast({
          title: "Error",
          description: "Failed to load lab scripts. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load lab scripts. Please try refreshing the page.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <ScriptStatusCards 
        onFilterChange={setStatusFilter}
        activeFilter={statusFilter}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <ScrollArea className="h-[500px]">
          <LabScriptList 
            labScripts={labScripts}
            onRowClick={onScriptSelect}
            onEditClick={onScriptEdit}
            onDeleteClick={onScriptDelete}
          />
        </ScrollArea>
      </div>
    </>
  );
};