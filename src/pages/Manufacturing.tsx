import { useState } from "react";
import { Printer, Grid, Factory, Settings } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Manufacturing = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
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
  const { toast } = useToast();

  const handleCardClick = (filter: string | null) => {
    setActiveFilter(filter === activeFilter ? null : filter);
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
      icon: Grid,
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
      icon: Settings,
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

  const handleManufacturingAction = async (scriptId: string, action: 'complete' | 'hold') => {
    try {
      const { error } = await supabase
        .from('manufacturing_logs')
        .update({ 
          manufacturing_status: action === 'complete' ? 'completed' : 'hold',
          manufacturing_completed_at: action === 'complete' ? new Date().toISOString() : null,
          manufacturing_hold_at: action === 'hold' ? new Date().toISOString() : null
        })
        .eq('lab_script_id', scriptId);

      if (error) throw error;

      toast({
        title: action === 'complete' ? "Manufacturing Completed" : "Manufacturing On Hold",
        description: `The manufacturing process has been ${action === 'complete' ? 'completed' : 'put on hold'}.`
      });
    } catch (error) {
      console.error('Error updating manufacturing status:', error);
      toast({
        title: "Error",
        description: "Failed to update manufacturing status",
        variant: "destructive"
      });
    }
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
              <Card 
                key={script.id} 
                className="p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {script.applianceType} | {script.upperDesignName || 'No upper appliance'} | {script.lowerDesignName || 'No lower appliance'}
                    </h3>
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
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleManufacturingAction(script.id, 'complete')}
                    >
                      Complete Printing
                    </Button>
                    <Button
                      variant="outline"
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      onClick={() => handleManufacturingAction(script.id, 'hold')}
                    >
                      Hold Printing
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Manufacturing;