import { Printer, CircuitBoard, Factory, Cog } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { ManufacturingStatus } from "@/components/manufacturing/ManufacturingStatus";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const handleCardClick = (filter: string | null) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  // Manufacturing handlers
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
      toast({ title: "Manufacturing started" });
    } catch (error) {
      console.error("Error starting manufacturing:", error);
      toast({ title: "Error", description: "Failed to start manufacturing", variant: "destructive" });
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
      toast({ title: "Manufacturing completed" });
    } catch (error) {
      console.error("Error completing manufacturing:", error);
      toast({ title: "Error", description: "Failed to complete manufacturing", variant: "destructive" });
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
      toast({ title: "Manufacturing on hold" });
    } catch (error) {
      console.error("Error holding manufacturing:", error);
      toast({ title: "Error", description: "Failed to hold manufacturing", variant: "destructive" });
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
      toast({ title: "Manufacturing resumed" });
    } catch (error) {
      console.error("Error resuming manufacturing:", error);
      toast({ title: "Error", description: "Failed to resume manufacturing", variant: "destructive" });
    }
  };

  // Sintering handlers
  const handleStartSintering = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          sintering_status: 'in_progress',
          sintering_started_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "Sintering started" });
    } catch (error) {
      console.error("Error starting sintering:", error);
      toast({ title: "Error", description: "Failed to start sintering", variant: "destructive" });
    }
  };

  const handleCompleteSintering = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          sintering_status: 'completed',
          sintering_completed_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "Sintering completed" });
    } catch (error) {
      console.error("Error completing sintering:", error);
      toast({ title: "Error", description: "Failed to complete sintering", variant: "destructive" });
    }
  };

  const handleHoldSintering = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          sintering_status: 'on_hold',
          sintering_hold_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "Sintering on hold" });
    } catch (error) {
      console.error("Error holding sintering:", error);
      toast({ title: "Error", description: "Failed to hold sintering", variant: "destructive" });
    }
  };

  const handleResumeSintering = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          sintering_status: 'in_progress',
          sintering_hold_at: null
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "Sintering resumed" });
    } catch (error) {
      console.error("Error resuming sintering:", error);
      toast({ title: "Error", description: "Failed to resume sintering", variant: "destructive" });
    }
  };

  // MIYO handlers
  const handleStartMiyo = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          miyo_status: 'in_progress',
          miyo_started_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "MIYO started" });
    } catch (error) {
      console.error("Error starting MIYO:", error);
      toast({ title: "Error", description: "Failed to start MIYO", variant: "destructive" });
    }
  };

  const handleCompleteMiyo = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          miyo_status: 'completed',
          miyo_completed_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "MIYO completed" });
    } catch (error) {
      console.error("Error completing MIYO:", error);
      toast({ title: "Error", description: "Failed to complete MIYO", variant: "destructive" });
    }
  };

  const handleHoldMiyo = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          miyo_status: 'on_hold',
          miyo_hold_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "MIYO on hold" });
    } catch (error) {
      console.error("Error holding MIYO:", error);
      toast({ title: "Error", description: "Failed to hold MIYO", variant: "destructive" });
    }
  };

  const handleResumeMiyo = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          miyo_status: 'in_progress',
          miyo_hold_at: null
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "MIYO resumed" });
    } catch (error) {
      console.error("Error resuming MIYO:", error);
      toast({ title: "Error", description: "Failed to resume MIYO", variant: "destructive" });
    }
  };

  // Inspection handlers
  const handleStartInspection = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          inspection_status: 'in_progress',
          inspection_started_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "Inspection started" });
    } catch (error) {
      console.error("Error starting inspection:", error);
      toast({ title: "Error", description: "Failed to start inspection", variant: "destructive" });
    }
  };

  const handleCompleteInspection = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          inspection_status: 'completed',
          inspection_completed_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "Inspection completed" });
    } catch (error) {
      console.error("Error completing inspection:", error);
      toast({ title: "Error", description: "Failed to complete inspection", variant: "destructive" });
    }
  };

  const handleHoldInspection = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          inspection_status: 'on_hold',
          inspection_hold_at: new Date().toISOString()
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "Inspection on hold" });
    } catch (error) {
      console.error("Error holding inspection:", error);
      toast({ title: "Error", description: "Failed to hold inspection", variant: "destructive" });
    }
  };

  const handleResumeInspection = async (scriptId: string) => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          inspection_status: 'in_progress',
          inspection_hold_at: null
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;
      toast({ title: "Inspection resumed" });
    } catch (error) {
      console.error("Error resuming inspection:", error);
      toast({ title: "Error", description: "Failed to resume inspection", variant: "destructive" });
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

  const getFilteredScripts = () => {
    if (!activeFilter) return manufacturingData.scripts;
    return cards.find(card => card.filter === activeFilter)?.scripts || [];
  };

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
                      manufacturingType={script.manufacturingType}
                    />
                  </div>
                )}

                <div className="text-sm">
                  <ManufacturingStatus 
                    manufacturingType={script.manufacturingType}
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
      </div>
    </div>
  );
};

export default Manufacturing;
