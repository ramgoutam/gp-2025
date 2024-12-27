import React from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardActions } from "./CardActions";
import { StatusButton } from "./StatusButton";
import { EditLabScriptButton } from "@/components/lab-script/EditLabScriptButton";
import { EditLabScriptForm } from "@/components/lab-script/EditLabScriptForm";
import { LabScript, DatabaseLabScript, mapDatabaseLabScript } from "@/types/labScript";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LabScriptCardProps {
  script: LabScript;
  onClick: () => void;
  onDelete: () => void;
  onStatusChange: (script: LabScript, newStatus: LabScript['status']) => void;
}

export const LabScriptCard = ({
  script,
  onClick,
  onDelete,
  onStatusChange,
}: LabScriptCardProps) => {
  const [showEditForm, setShowEditForm] = React.useState(false);
  const { toast } = useToast();

  const { data: updatedScript } = useQuery({
    queryKey: ['labScript', script.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('id', script.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch lab script updates",
          variant: "destructive",
        });
        return script;
      }

      return mapDatabaseLabScript(data as DatabaseLabScript);
    },
    refetchInterval: 1000,
    initialData: script,
  });

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleScriptUpdate = (updatedScript: LabScript) => {
    console.log("Script updated:", updatedScript);
    toast({
      title: "Success",
      description: "Lab script updated successfully",
    });
  };

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-gradient-to-br from-white to-purple-50/30 animate-fade-in">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">{updatedScript.applianceType || "N/A"}</span>
                <Badge variant="outline" className="px-3 py-1 uppercase text-xs font-medium transition-all duration-300">
                  {updatedScript.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>Created: {format(new Date(updatedScript.requestDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Due: {format(new Date(updatedScript.dueDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Doctor: {updatedScript.doctorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Clinic: {updatedScript.clinicName}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <EditLabScriptButton onClick={handleEditClick} />
                <CardActions
                  onView={onClick}
                  onDelete={onDelete}
                />
              </div>
              <StatusButton 
                script={updatedScript}
                status={updatedScript.status} 
                onStatusChange={(newStatus) => onStatusChange(updatedScript, newStatus)}
              />
            </div>
          </div>
        </div>
      </Card>

      <EditLabScriptForm
        script={updatedScript}
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onUpdate={handleScriptUpdate}
      />
    </>
  );
};
