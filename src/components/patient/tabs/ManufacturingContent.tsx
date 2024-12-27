import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ManufacturingContentProps {
  patientId: string;
}

export const ManufacturingContent = ({ patientId }: ManufacturingContentProps) => {
  const { data: labScripts = [] } = useQuery({
    queryKey: ['patientLabScripts', patientId],
    queryFn: async () => {
      console.log("Fetching lab scripts for manufacturing view:", patientId);
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          report_cards (
            design_info_status,
            clinical_info_status
          )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching lab scripts:", error);
        throw error;
      }

      console.log("Retrieved lab scripts:", data);
      return data;
    },
  });

  if (!labScripts.length) {
    return (
      <div className="text-center p-6 text-gray-500">
        No lab scripts found for this patient.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4 p-4">
        {labScripts.map((script) => (
          <Card key={script.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Appliance Type</h4>
                <p className="text-lg">{script.appliance_type || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Appliance Numbers</h4>
                <div className="space-y-1">
                  {script.upper_design_name && (
                    <p>Upper: {script.upper_design_name}</p>
                  )}
                  {script.lower_design_name && (
                    <p>Lower: {script.lower_design_name}</p>
                  )}
                  {!script.upper_design_name && !script.lower_design_name && (
                    <p>Not specified</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Material</h4>
                <p>{script.material || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Shade</h4>
                <p>{script.shade || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500">Manufacturing Details</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {script.manufacturing_source || 'Not specified'}
                  </span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {script.manufacturing_type || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};