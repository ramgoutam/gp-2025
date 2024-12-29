import { Printer, CircuitBoard, Factory, Cog } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { useManufacturingLogs } from "@/hooks/useManufacturingLogs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Manufacturing = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { toast } = useToast();
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
  } = useManufacturingLogs(manufacturingData.scripts);

  const handleCardClick = (filter: string | null) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  const getFilteredScripts = () => {
    if (!activeFilter) return manufacturingData.scripts;
    return manufacturingData.scripts.filter(script => {
      switch (activeFilter) {
        case 'inhouse-printing':
          return script.manufacturingSource === 'Inhouse' && script.manufacturingType === 'Printing';
        case 'inhouse-milling':
          return script.manufacturingSource === 'Inhouse' && script.manufacturingType === 'Milling';
        case 'outsource-printing':
          return script.manufacturingSource === 'Outsource' && script.manufacturingType === 'Printing';
        case 'outsource-milling':
          return script.manufacturingSource === 'Outsource' && script.manufacturingType === 'Milling';
        default:
          return true;
      }
    });
  };

  const handleStartManufacturing = async (scriptId: string) => {
    try {
      console.log("Starting manufacturing process for script:", scriptId);
      const timestamp = new Date().toISOString();
      
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'in_progress',
          manufacturing_started_at: timestamp
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      toast({
        title: "Manufacturing Started",
        description: "The manufacturing process has been started"
      });
    } catch (error) {
      console.error("Error starting manufacturing:", error);
      toast({
        title: "Error",
        description: "Failed to start manufacturing process",
        variant: "destructive"
      });
    }
  };

  const handleCompleteManufacturing = async (scriptId: string) => {
    try {
      console.log("Completing manufacturing process for script:", scriptId);
      const timestamp = new Date().toISOString();
      
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'completed',
          manufacturing_completed_at: timestamp
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      toast({
        title: "Manufacturing Completed",
        description: "The manufacturing process has been completed"
      });
    } catch (error) {
      console.error("Error completing manufacturing:", error);
      toast({
        title: "Error",
        description: "Failed to complete manufacturing process",
        variant: "destructive"
      });
    }
  };

  const handleHoldManufacturing = async (scriptId: string) => {
    try {
      console.log("Holding manufacturing process for script:", scriptId);
      const timestamp = new Date().toISOString();
      
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({
          manufacturing_status: 'on_hold',
          manufacturing_hold_at: timestamp
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      toast({
        title: "Manufacturing On Hold",
        description: "The manufacturing process has been put on hold"
      });
    } catch (error) {
      console.error("Error holding manufacturing:", error);
      toast({
        title: "Error",
        description: "Failed to hold manufacturing process",
        variant: "destructive"
      });
    }
  };

  const handleResumeManufacturing = async (scriptId: string) => {
    try {
      console.log("Resuming manufacturing process for script:", scriptId);
      
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
        description: "The manufacturing process has been resumed"
      });
    } catch (error) {
      console.error("Error resuming manufacturing:", error);
      toast({
        title: "Error",
        description: "Failed to resume manufacturing process",
        variant: "destructive"
      });
    }
  };

  const cards = [
    {
      title: "Inhouse Printing",
      count: manufacturingData.counts.inhousePrinting,
      icon: Printer,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-500",
      filter: "inhouse-printing",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Printing'
      )
    },
    {
      title: "Inhouse Milling",
      count: manufacturingData.counts.inhouseMilling,
      icon: CircuitBoard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progressColor: "bg-purple-500",
      filter: "inhouse-milling",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'Inhouse' && s.manufacturingType === 'Milling'
      )
    },
    {
      title: "Outsource Printing",
      count: manufacturingData.counts.outsourcePrinting,
      icon: Factory,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500",
      filter: "outsource-printing",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Printing'
      )
    },
    {
      title: "Outsource Milling",
      count: manufacturingData.counts.outsourceMilling,
      icon: Cog,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progressColor: "bg-green-500",
      filter: "outsource-milling",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'Outsource' && s.manufacturingType === 'Milling'
      )
    }
  ];

  return (
    <div className="container mx-auto p-8 space-y-6">
      <ManufacturingHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <ManufacturingCard
            key={card.title}
            {...card}
            isActive={activeFilter === card.filter}
            onClick={() => handleCardClick(card.filter)}
          />
        ))}
      </div>
      
      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Manufacturing Queue</h2>
          <div className="space-y-4">
            {getFilteredScripts().map((script) => (
              <div 
                key={script.id} 
                className="p-6 bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 group animate-fade-in"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {script.applianceType || 'N/A'} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                        <div>
                          <p className="text-gray-500 text-xs">Manufacturing Source</p>
                          <p className="font-medium">{script.manufacturingSource}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Manufacturing Type</p>
                          <p className="font-medium">{script.manufacturingType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Material</p>
                          <p className="font-medium">{script.material || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Shade</p>
                          <p className="font-medium">{script.shade || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    {script.manufacturingSource === 'Inhouse' && (
                      <ManufacturingSteps
                        scriptId={script.id}
                        manufacturingStatus={manufacturingStatus[script.id] || 'pending'}
                        sinteringStatus={sinteringStatus[script.id] || 'pending'}
                        miyoStatus={miyoStatus[script.id] || 'pending'}
                        inspectionStatus={inspectionStatus[script.id] || 'pending'}
                        manufacturingType={script.manufacturingType}
                        onStartManufacturing={handleStartManufacturing}
                        onCompleteManufacturing={handleCompleteManufacturing}
                        onHoldManufacturing={handleHoldManufacturing}
                        onResumeManufacturing={handleResumeManufacturing}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Manufacturing;