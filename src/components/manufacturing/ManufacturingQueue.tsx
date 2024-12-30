import { Card } from "@/components/ui/card";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ManufacturingQueueProps {
  scripts: LabScript[];
}

export const ManufacturingQueue = ({ scripts }: ManufacturingQueueProps) => {
  const { toast } = useToast();

  // Real-time query for manufacturing logs
  const { data: manufacturingData } = useQuery({
    queryKey: ['manufacturingLogs'],
    queryFn: async () => {
      console.log("Fetching manufacturing logs");
      const { data, error } = await supabase
        .from('manufacturing_logs')
        .select('*')
        .in('lab_script_id', scripts.map(s => s.id));

      if (error) {
        console.error("Error fetching manufacturing logs:", error);
        throw error;
      }

      const statusMaps = {
        manufacturingStatus: {},
        sinteringStatus: {},
        miyoStatus: {},
        inspectionStatus: {}
      };

      data?.forEach(log => {
        statusMaps.manufacturingStatus[log.lab_script_id] = log.manufacturing_status;
        statusMaps.sinteringStatus[log.lab_script_id] = log.sintering_status;
        statusMaps.miyoStatus[log.lab_script_id] = log.miyo_status;
        statusMaps.inspectionStatus[log.lab_script_id] = log.inspection_status;
      });

      return statusMaps;
    },
    refetchInterval: 1, // Poll every 1ms for instant updates
  });

  const handleStartManufacturing = async (scriptId: string) => {
    try {
      console.log("Starting manufacturing for script:", scriptId);
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'in_progress',
          manufacturing_started_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      toast({
        title: "Manufacturing Started",
        description: "The manufacturing process has been initiated."
      });
    } catch (error) {
      console.error('Error starting manufacturing:', error);
      toast({
        title: "Error",
        description: "Failed to start manufacturing process",
        variant: "destructive"
      });
    }
  };

  const handleCompleteManufacturing = async (scriptId: string) => {
    try {
      console.log("Completing manufacturing for script:", scriptId);
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'completed',
          manufacturing_completed_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      toast({
        title: "Manufacturing Completed",
        description: "The manufacturing process has been completed."
      });
    } catch (error) {
      console.error('Error completing manufacturing:', error);
      toast({
        title: "Error",
        description: "Failed to complete manufacturing process",
        variant: "destructive"
      });
    }
  };

  const handleHoldManufacturing = async (scriptId: string) => {
    try {
      console.log("Holding manufacturing for script:", scriptId);
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'on_hold',
          manufacturing_hold_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      toast({
        title: "Manufacturing On Hold",
        description: "The manufacturing process has been put on hold."
      });
    } catch (error) {
      console.error('Error holding manufacturing:', error);
      toast({
        title: "Error",
        description: "Failed to put manufacturing process on hold",
        variant: "destructive"
      });
    }
  };

  const handleResumeManufacturing = async (scriptId: string) => {
    try {
      console.log("Resuming manufacturing for script:", scriptId);
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'in_progress',
          manufacturing_hold_at: null
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      toast({
        title: "Manufacturing Resumed",
        description: "The manufacturing process has been resumed."
      });
    } catch (error) {
      console.error('Error resuming manufacturing:', error);
      toast({
        title: "Error",
        description: "Failed to resume manufacturing process",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Manufacturing Queue</h2>
      <div className="space-y-4">
        {scripts.map((script) => (
          <Card key={script.id} className="p-4 transition-all duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ScriptInfo
                  applianceType={script.applianceType || ''}
                  upperDesignName={script.upperDesignName || ''}
                  lowerDesignName={script.lowerDesignName || ''}
                  manufacturingSource={script.manufacturingSource || ''}
                  manufacturingType={script.manufacturingType || ''}
                  material={script.material || ''}
                  shade={script.shade || ''}
                  designInfo={script.designInfo}
                  patientFirstName={script.patientFirstName}
                  patientLastName={script.patientLastName}
                />
                {script.manufacturingSource === 'Inhouse' && (
                  <ManufacturingSteps
                    scriptId={script.id}
                    manufacturingStatus={manufacturingData?.manufacturingStatus[script.id] || 'pending'}
                    sinteringStatus={manufacturingData?.sinteringStatus[script.id] || 'pending'}
                    miyoStatus={manufacturingData?.miyoStatus[script.id] || 'pending'}
                    inspectionStatus={manufacturingData?.inspectionStatus[script.id] || 'pending'}
                    onStartManufacturing={handleStartManufacturing}
                    onCompleteManufacturing={handleCompleteManufacturing}
                    onHoldManufacturing={handleHoldManufacturing}
                    onResumeManufacturing={handleResumeManufacturing}
                    manufacturingType={script.manufacturingType}
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};