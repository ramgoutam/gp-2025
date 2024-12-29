import { Card } from "@/components/ui/card";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";
import { useManufacturingLogs } from "@/hooks/useManufacturingLogs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { Printer, Wrench, Factory, Settings } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Let's extract the stats cards configuration to a separate component
const statsCards = [
  {
    title: "Inhouse Printing",
    icon: Printer,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    progressColor: "bg-gradient-to-r from-blue-400 to-blue-500",
    type: "inhouse_printing"
  },
  {
    title: "Inhouse Milling",
    icon: Wrench,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    progressColor: "bg-gradient-to-r from-purple-400 to-purple-500",
    type: "inhouse_milling"
  },
  {
    title: "Outsource Printing",
    icon: Factory,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    progressColor: "bg-gradient-to-r from-orange-400 to-orange-500",
    type: "outsource_printing"
  },
  {
    title: "Outsource Milling",
    icon: Settings,
    color: "text-green-500",
    bgColor: "bg-green-50",
    progressColor: "bg-gradient-to-r from-green-400 to-green-500",
    type: "outsource_milling"
  }
];

const Manufacturing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { data: manufacturingData = {
    counts: {
      inhousePrinting: 0,
      inhouseMilling: 0,
      outsourcePrinting: 0,
      outsourceMilling: 0,
      total: 0
    },
    scripts: []
  }} = useManufacturingData();

  const {
    manufacturingStatus,
    sinteringStatus,
    miyoStatus,
    inspectionStatus,
    setManufacturingStatus,
    setSinteringStatus,
    setMiyoStatus,
    setInspectionStatus
  } = useManufacturingLogs(manufacturingData.scripts);

  const handleStartManufacturing = async (scriptId: string) => {
    try {
      setManufacturingStatus(prev => ({
        ...prev,
        [scriptId]: 'in_progress'
      }));

      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'in_progress',
          manufacturing_started_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['manufacturingData'] });

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
      setManufacturingStatus(prev => ({
        ...prev,
        [scriptId]: 'completed'
      }));

      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'completed',
          manufacturing_completed_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['manufacturingData'] });

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
      setManufacturingStatus(prev => ({
        ...prev,
        [scriptId]: 'on_hold'
      }));

      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'on_hold',
          manufacturing_hold_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['manufacturingData'] });

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
      setManufacturingStatus(prev => ({
        ...prev,
        [scriptId]: 'in_progress'
      }));

      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'in_progress',
          manufacturing_hold_at: null
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['manufacturingData'] });

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

  const filteredScripts = selectedType
    ? manufacturingData.scripts.filter(script => {
        const manufacturingSource = script.manufacturingSource?.toLowerCase();
        const manufacturingType = script.manufacturingType?.toLowerCase();
        const type = `${manufacturingSource}_${manufacturingType}`;
        return type === selectedType;
      })
    : manufacturingData.scripts;

  return (
    <div className="container mx-auto p-6 space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <ManufacturingCard
            key={card.title}
            title={card.title}
            count={manufacturingData.counts[card.type.replace('_', '') as keyof typeof manufacturingData.counts]}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
            progressColor={card.progressColor}
            scripts={manufacturingData.scripts}
            isActive={selectedType === card.type}
            onClick={() => setSelectedType(selectedType === card.type ? null : card.type)}
          />
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Manufacturing Queue</h2>
        <div className="space-y-4">
          {filteredScripts.map((script) => (
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
    </div>
  );
};

export default Manufacturing;