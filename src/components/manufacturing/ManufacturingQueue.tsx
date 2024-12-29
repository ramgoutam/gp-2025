import { Card } from "@/components/ui/card";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ManufacturingQueueProps {
  scripts: LabScript[];
  manufacturingStatus: Record<string, string>;
  sinteringStatus: Record<string, string>;
  miyoStatus: Record<string, string>;
  inspectionStatus: Record<string, string>;
}

export const ManufacturingQueue = ({
  scripts,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus
}: ManufacturingQueueProps) => {
  const { toast } = useToast();

  const handleStartManufacturing = async (scriptId: string) => {
    try {
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
                    manufacturingStatus={manufacturingStatus[script.id] || 'pending'}
                    sinteringStatus={sinteringStatus[script.id] || 'pending'}
                    miyoStatus={miyoStatus[script.id] || 'pending'}
                    inspectionStatus={inspectionStatus[script.id] || 'pending'}
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