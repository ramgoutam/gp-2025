import { Printer, CircuitBoard, Factory, Cog } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ManufacturingStage } from "@/components/patient/tabs/manufacturing/stages/ManufacturingStage";
import { SinteringStage } from "@/components/patient/tabs/manufacturing/stages/SinteringStage";
import { MiyoStage } from "@/components/patient/tabs/manufacturing/stages/MiyoStage";
import { InspectionStage } from "@/components/patient/tabs/manufacturing/stages/InspectionStage";
import { ScriptInfo } from "@/components/patient/tabs/manufacturing/ScriptInfo";

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
              <Card 
                key={script.id} 
                className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group bg-gradient-to-br from-white to-purple-50/30 animate-fade-in"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{script.applianceType || "N/A"}</span>
                          <span className="text-sm text-gray-500">|</span>
                          <span className="text-sm text-gray-600">Upper: {script.upperDesignName || "Not specified"}</span>
                          <span className="text-sm text-gray-500">|</span>
                          <span className="text-sm text-gray-600">Lower: {script.lowerDesignName || "Not specified"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>Patient: {script.patientFirstName} {script.patientLastName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Doctor: {script.doctorName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Material: {script.material || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Shade: {script.shade || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {script.manufacturingSource === 'Inhouse' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Manufacturing</h3>
                        <ManufacturingStage
                          scriptId={script.id}
                          status={script.manufacturing_logs?.manufacturing_status || 'pending'}
                          onStart={() => {}}
                          onComplete={() => {}}
                          onHold={() => {}}
                          onResume={() => {}}
                          manufacturingType={script.manufacturingType}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Sintering</h3>
                        <SinteringStage
                          scriptId={script.id}
                          status={script.manufacturing_logs?.sintering_status || 'pending'}
                          onStart={() => {}}
                          onComplete={() => {}}
                          onHold={() => {}}
                          onResume={() => {}}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">MIYO</h3>
                        <MiyoStage
                          scriptId={script.id}
                          status={script.manufacturing_logs?.miyo_status || 'pending'}
                          onStart={() => {}}
                          onComplete={() => {}}
                          onHold={() => {}}
                          onResume={() => {}}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Inspection</h3>
                        <InspectionStage
                          scriptId={script.id}
                          status={script.manufacturing_logs?.inspection_status || 'pending'}
                          onStart={() => {}}
                          onComplete={() => {}}
                          onHold={() => {}}
                          onResume={() => {}}
                        />
                      </div>
                    </div>
                  )}
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