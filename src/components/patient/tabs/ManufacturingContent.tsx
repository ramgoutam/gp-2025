import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ManufacturingContentProps {
  patientId: string;
}

export const ManufacturingContent = ({ patientId }: ManufacturingContentProps) => {
  const { data: labScripts, isLoading } = useQuery({
    queryKey: ['labScripts', patientId],
    queryFn: async () => {
      console.log('Fetching lab scripts for patient:', patientId);
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)] w-full">
      <div className="space-y-4 p-4">
        {labScripts?.map((script) => (
          <Card key={script.id} className="p-4">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Appliance Type</p>
                  <p>{script.appliance_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Appliance Numbers</p>
                  <div>
                    {script.upper_design_name && (
                      <p>Upper: {script.upper_design_name}</p>
                    )}
                    {script.lower_design_name && (
                      <p>Lower: {script.lower_design_name}</p>
                    )}
                    {!script.upper_design_name && !script.lower_design_name && 'N/A'}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Material</p>
                  <p>{script.material || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Shade</p>
                  <p>{script.shade || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};