import React, { useEffect } from "react";
import { LabScript } from "@/types/labScript";
import { Card } from "@/components/ui/card";
import { Factory, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ManufacturingContentProps {
  labScripts: LabScript[];
  patientData: {
    firstName: string;
    lastName: string;
  };
}

export const ManufacturingContent = ({ labScripts: initialScripts, patientData }: ManufacturingContentProps) => {
  const queryClient = useQueryClient();

  // Query for real-time script updates
  const { data: manufacturingScripts = [] } = useQuery({
    queryKey: ['manufacturingScripts', initialScripts],
    queryFn: async () => {
      console.log("Fetching manufacturing scripts status");
      
      try {
        const { data: scripts, error } = await supabase
          .from('lab_scripts')
          .select('*')
          .in('id', initialScripts.map(s => s.id));

        if (error) {
          console.error("Error fetching scripts:", error);
          return initialScripts;
        }

        console.log("Fetched updated scripts:", scripts);
        return scripts.filter(script => 
          script.manufacturing_source && script.manufacturing_type
        );
      } catch (error) {
        console.error("Error in manufacturing scripts query:", error);
        return initialScripts;
      }
    },
    refetchInterval: 1, // Refetch every millisecond
    initialData: initialScripts.filter(script => 
      script.manufacturingSource && script.manufacturingType
    ),
  });

  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up real-time subscription for manufacturing scripts");
    
    const channel = supabase
      .channel('manufacturing-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_scripts',
          filter: `id=in.(${initialScripts.map(s => `'${s.id}'`).join(',')})`
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          queryClient.invalidateQueries({ queryKey: ['manufacturingScripts'] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [initialScripts, queryClient]);

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
                  {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
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
                  <p className="font-medium">{script.manufacturingSource}</p>
                </div>
                <div>
                  <p className="text-gray-500">Manufacturing Type</p>
                  <p className="font-medium">{script.manufacturingType}</p>
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