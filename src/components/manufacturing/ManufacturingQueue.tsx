import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ManufacturingStatus } from "@/components/manufacturing/ManufacturingStatus";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ManufacturingQueueProps {
  scripts: LabScript[];
}

export const ManufacturingQueue = ({ scripts }: ManufacturingQueueProps) => {
  const { toast } = useToast();

  const handleStartManufacturing = async (scriptId: string) => {
    console.log('Starting manufacturing process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        manufacturing_status: 'in_progress',
        manufacturing_started_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating manufacturing status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start manufacturing process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Manufacturing process started"
    });
  };

  const handleCompleteManufacturing = async (scriptId: string) => {
    console.log('Completing manufacturing process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        manufacturing_status: 'completed',
        manufacturing_completed_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating manufacturing status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete manufacturing process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Manufacturing process completed"
    });
  };

  const handleHoldManufacturing = async (scriptId: string) => {
    console.log('Holding manufacturing process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        manufacturing_status: 'on_hold',
        manufacturing_hold_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating manufacturing status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to hold manufacturing process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Manufacturing process put on hold"
    });
  };

  const handleResumeManufacturing = async (scriptId: string) => {
    console.log('Resuming manufacturing process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        manufacturing_status: 'in_progress',
        manufacturing_hold_at: null
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating manufacturing status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resume manufacturing process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Manufacturing process resumed"
    });
  };

  // Handlers for sintering stage
  const handleStartSintering = async (scriptId: string) => {
    console.log('Starting sintering process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        sintering_status: 'in_progress',
        sintering_started_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating sintering status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start sintering process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Sintering process started"
    });
  };

  const handleCompleteSintering = async (scriptId: string) => {
    console.log('Completing sintering process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        sintering_status: 'completed',
        sintering_completed_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating sintering status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete sintering process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Sintering process completed"
    });
  };

  const handleHoldSintering = async (scriptId: string) => {
    console.log('Holding sintering process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        sintering_status: 'on_hold',
        sintering_hold_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating sintering status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to hold sintering process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Sintering process put on hold"
    });
  };

  const handleResumeSintering = async (scriptId: string) => {
    console.log('Resuming sintering process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        sintering_status: 'in_progress',
        sintering_hold_at: null
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating sintering status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resume sintering process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Sintering process resumed"
    });
  };

  // Handlers for MIYO stage
  const handleStartMiyo = async (scriptId: string) => {
    console.log('Starting MIYO process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        miyo_status: 'in_progress',
        miyo_started_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating MIYO status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start MIYO process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "MIYO process started"
    });
  };

  const handleCompleteMiyo = async (scriptId: string) => {
    console.log('Completing MIYO process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        miyo_status: 'completed',
        miyo_completed_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating MIYO status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete MIYO process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "MIYO process completed"
    });
  };

  const handleHoldMiyo = async (scriptId: string) => {
    console.log('Holding MIYO process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        miyo_status: 'on_hold',
        miyo_hold_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating MIYO status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to hold MIYO process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "MIYO process put on hold"
    });
  };

  const handleResumeMiyo = async (scriptId: string) => {
    console.log('Resuming MIYO process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        miyo_status: 'in_progress',
        miyo_hold_at: null
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating MIYO status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resume MIYO process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "MIYO process resumed"
    });
  };

  // Handlers for Inspection stage
  const handleStartInspection = async (scriptId: string) => {
    console.log('Starting inspection process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        inspection_status: 'in_progress',
        inspection_started_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating inspection status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start inspection process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Inspection process started"
    });
  };

  const handleCompleteInspection = async (scriptId: string) => {
    console.log('Completing inspection process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        inspection_status: 'completed',
        inspection_completed_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating inspection status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete inspection process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Inspection process completed"
    });
  };

  const handleHoldInspection = async (scriptId: string) => {
    console.log('Holding inspection process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        inspection_status: 'on_hold',
        inspection_hold_at: new Date().toISOString()
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating inspection status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to hold inspection process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Inspection process put on hold"
    });
  };

  const handleResumeInspection = async (scriptId: string) => {
    console.log('Resuming inspection process for script:', scriptId);
    const { error } = await supabase
      .from('manufacturing_logs')
      .update({
        inspection_status: 'in_progress',
        inspection_hold_at: null
      })
      .eq('lab_script_id', scriptId);

    if (error) {
      console.error('Error updating inspection status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resume inspection process"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Inspection process resumed"
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Manufacturing Queue</h2>
      <div className="space-y-4">
        {scripts.map((script) => (
          <div 
            key={script.id} 
            className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-2 flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">
                      {script.patientFirstName} {script.patientLastName}
                    </span>
                    <Badge variant="outline" className="bg-white">
                      {script.manufacturingSource} - {script.manufacturingType}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Appliance Numbers: </span>
                    {script.upperDesignName || 'No upper'} | {script.lowerDesignName || 'No lower'}
                  </div>
                  <div>
                    <span className="font-medium">Material: </span>
                    {script.material || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Shade: </span>
                    {script.shade || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {script.manufacturingSource === 'Inhouse' && (
              <div className="border-t pt-4">
                <ManufacturingSteps
                  scriptId={script.id}
                  manufacturingStatus={script.manufacturing_logs?.manufacturing_status || 'pending'}
                  sinteringStatus={script.manufacturing_logs?.sintering_status || 'pending'}
                  miyoStatus={script.manufacturing_logs?.miyo_status || 'pending'}
                  inspectionStatus={script.manufacturing_logs?.inspection_status || 'pending'}
                  manufacturingType={script.manufacturingType || ''}
                  onStartManufacturing={handleStartManufacturing}
                  onCompleteManufacturing={handleCompleteManufacturing}
                  onHoldManufacturing={handleHoldManufacturing}
                  onResumeManufacturing={handleResumeManufacturing}
                  onStartSintering={handleStartSintering}
                  onCompleteSintering={handleCompleteSintering}
                  onHoldSintering={handleHoldSintering}
                  onResumeSintering={handleResumeSintering}
                  onStartMiyo={handleStartMiyo}
                  onCompleteMiyo={handleCompleteMiyo}
                  onHoldMiyo={handleHoldMiyo}
                  onResumeMiyo={handleResumeMiyo}
                  onStartInspection={handleStartInspection}
                  onCompleteInspection={handleCompleteInspection}
                  onHoldInspection={handleHoldInspection}
                  onResumeInspection={handleResumeInspection}
                />
              </div>
            )}

            <div className="text-sm">
              <ManufacturingStatus 
                manufacturingType={script.manufacturingType || ''}
                manufacturingLogs={script.manufacturing_logs || {
                  manufacturing_status: 'pending',
                  sintering_status: 'pending',
                  miyo_status: 'pending',
                  inspection_status: 'pending'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};