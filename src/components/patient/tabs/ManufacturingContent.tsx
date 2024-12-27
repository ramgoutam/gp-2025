import React from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts: initialScripts, patientData }: ManufacturingContentProps) => {
  // Add real-time query for script status
  const { data: updatedScripts } = useQuery({
    queryKey: ['manufacturingScripts', initialScripts.map(s => s.id)],
    queryFn: async () => {
      console.log("Fetching manufacturing scripts status");
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .in('id', initialScripts.map(s => s.id));

      if (error) {
        console.error("Error fetching scripts:", error);
        throw error;
      }

      console.log("Fetched updated scripts:", data);
      return data;
    },
    refetchInterval: 1000, // Poll every second
    initialData: initialScripts,
  });

  const manufacturingScripts = (updatedScripts || []).filter(script => 
    script.manufacturing_source && script.manufacturing_type
  );

  if (manufacturingScripts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <Factory className="w-12 h-12 text-gray-400" />
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">No Manufacturing Data</h3>
            <p className="text-sm text-gray-500">
              There are no lab scripts with manufacturing information for {patientData.firstName} {patientData.lastName}.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {manufacturingScripts.map((script) => (
          <Card key={script.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {script.appliance_type || 'N/A'} | {script.upper_design_name || 'No upper appliance'} | {script.lower_design_name || 'No lower appliance'}
                </h3>
                <Badge 
                  variant={script.status === 'completed' ? "default" : "secondary"}
                >
                  {script.status === 'completed' ? 'Design-Info Pending' : 'Design Pending'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Manufacturing Source</p>
                  <p className="font-medium">{script.manufacturing_source}</p>
                </div>
                <div>
                  <p className="text-gray-500">Manufacturing Type</p>
                  <p className="font-medium">{script.manufacturing_type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Material</p>
                  <p className="font-medium">{script.material || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Shade</p>
                  <p className="font-medium">{script.shade || 'N/A'}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => console.log('Starting manufacturing process for script:', script.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};