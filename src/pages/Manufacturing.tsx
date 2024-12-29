import { Printer, CircuitBoard, Factory, Cog } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManufacturingSteps } from "@/components/patient/tabs/manufacturing/ManufacturingSteps";
import { useManufacturingLogs } from "@/hooks/useManufacturingLogs";

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

  const { 
    manufacturingStatus,
    sinteringStatus,
    miyoStatus,
    inspectionStatus
  } = useManufacturingLogs(manufacturingData.scripts);

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