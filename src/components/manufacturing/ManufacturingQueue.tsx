import { Card } from "@/components/ui/card";
import { LabScript } from "@/types/labScript";
import { StatusMap } from "@/types/manufacturing";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ManufacturingQueueProps {
  scripts: LabScript[];
  manufacturingStatus: StatusMap;
  sinteringStatus: StatusMap;
  miyoStatus: StatusMap;
  inspectionStatus: StatusMap;
}

export const ManufacturingQueue = ({ 
  scripts,
  manufacturingStatus,
  sinteringStatus,
  miyoStatus,
  inspectionStatus 
}: ManufacturingQueueProps) => {
  const { toast } = useToast();

  const updateManufacturingStatus = async (
    scriptId: string, 
    newStatus: string, 
    stage: string,
    timestamp: string,
    holdReason?: string
  ) => {
    try {
      console.log(`Updating ${stage} status:`, newStatus, "for script:", scriptId);
      
      const updates: any = {
        [`${stage}_status`]: newStatus,
      };

      if (timestamp) {
        updates[timestamp] = new Date().toISOString();
      }

      if (holdReason) {
        updates[`${stage}_hold_reason`] = holdReason;
      }

      const { error } = await supabase
        .from('manufacturing_logs')
        .update(updates)
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      console.log(`${stage} status updated successfully`);
      toast({
        title: "Status Updated",
        description: `${stage} ${newStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error(`Error updating ${stage} status:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${stage} status`,
        variant: "destructive"
      });
    }
  };

  const handleStartManufacturing = async (scriptId: string) => {
    await updateManufacturingStatus(
      scriptId,
      'in_progress',
      'manufacturing',
      'manufacturing_started_at'
    );
  };

  const handleCompleteManufacturing = async (scriptId: string) => {
    await updateManufacturingStatus(
      scriptId,
      'completed',
      'manufacturing',
      'manufacturing_completed_at'
    );
  };

  const handleHoldManufacturing = async (scriptId: string) => {
    await updateManufacturingStatus(
      scriptId,
      'on_hold',
      'manufacturing',
      'manufacturing_hold_at'
    );
  };

  const handleResumeManufacturing = async (scriptId: string) => {
    await updateManufacturingStatus(
      scriptId,
      'in_progress',
      'manufacturing',
      'manufacturing_started_at'
    );
  };

  const handleStartInspection = async (scriptId: string) => {
    await updateManufacturingStatus(
      scriptId,
      'in_progress',
      'inspection',
      'inspection_started_at'
    );
  };

  const handleCompleteInspection = async (scriptId: string) => {
    await updateManufacturingStatus(
      scriptId,
      'completed',
      'inspection',
      'inspection_completed_at'
    );
  };

  const handleHoldInspection = async (scriptId: string) => {
    await updateManufacturingStatus(
      scriptId,
      'on_hold',
      'inspection',
      'inspection_hold_at'
    );
  };

  const handleResumeInspection = async (scriptId: string) => {
    await updateManufacturingStatus(
      scriptId,
      'in_progress',
      'inspection',
      'inspection_started_at'
    );
  };

  if (scripts.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          No manufacturing items available
        </div>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 pr-4">
        {scripts.map((script) => (
          <Card key={script.id} className="p-4 transition-all duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <ScriptInfo
                  applianceType={script.applianceType}
                  upperDesignName={script.upperDesignName}
                  lowerDesignName={script.lowerDesignName}
                  manufacturingSource={script.manufacturingSource}
                  manufacturingType={script.manufacturingType}
                  material={script.material}
                  shade={script.shade}
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
                    onStartInspection={handleStartInspection}
                    onCompleteInspection={handleCompleteInspection}
                    onHoldInspection={handleHoldInspection}
                    onResumeInspection={handleResumeInspection}
                    manufacturingType={script.manufacturingType}
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};