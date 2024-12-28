import { Printer, CircuitBoard, Factory, Cog } from "lucide-react";
import { ManufacturingCard } from "./ManufacturingCard";
import { LabScript } from "@/types/labScript";

interface ManufacturingCardsProps {
  manufacturingData: {
    counts: {
      inhousePrinting: number;
      inhouseMilling: number;
      outsourcePrinting: number;
      outsourceMilling: number;
    };
    scripts: LabScript[];
  };
  activeFilter: string | null;
  onCardClick: (filter: string | null) => void;
}

export const ManufacturingCards = ({ 
  manufacturingData, 
  activeFilter, 
  onCardClick 
}: ManufacturingCardsProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <ManufacturingCard
          key={card.title}
          {...card}
          isActive={activeFilter === card.filter}
          onClick={() => onCardClick(card.filter)}
        />
      ))}
    </div>
  );
};