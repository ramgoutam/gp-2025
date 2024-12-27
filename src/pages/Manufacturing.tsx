import { Printer, CircuitBoard, Factory, Cog, CheckCircle } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";

const Manufacturing = () => {
  const { data: manufacturingData = {
    counts: {
      inhousePrinting: 0,
      inhouseMilling: 0,
      outsourcePrinting: 0,
      outsourceMilling: 0,
      total: 0,
      completedOutsourceMilling: 0
    },
    scripts: []
  }} = useManufacturingData();

  const cards = [
    {
      title: "Inhouse Printing",
      count: manufacturingData.counts.inhousePrinting,
      icon: Printer,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'inhouse' && s.manufacturingType === 'printing'
      )
    },
    {
      title: "Inhouse Milling",
      count: manufacturingData.counts.inhouseMilling,
      icon: CircuitBoard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progressColor: "bg-purple-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'inhouse' && s.manufacturingType === 'milling'
      )
    },
    {
      title: "Outsource Printing",
      count: manufacturingData.counts.outsourcePrinting,
      icon: Factory,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'outsource' && s.manufacturingType === 'printing'
      )
    },
    {
      title: "Outsource Milling",
      count: manufacturingData.counts.outsourceMilling,
      icon: Cog,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progressColor: "bg-green-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'outsource' && s.manufacturingType === 'milling'
      )
    },
    {
      title: "Completed",
      count: manufacturingData.counts.completedOutsourceMilling,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      progressColor: "bg-emerald-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'outsource' && 
        s.manufacturingType === 'milling' && 
        s.status === 'completed'
      )
    }
  ];

  return (
    <div className="container mx-auto p-8 space-y-6">
      <ManufacturingHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card) => (
          <ManufacturingCard
            key={card.title}
            {...card}
          />
        ))}
      </div>
    </div>
  );
};

export default Manufacturing;
