import { Printer, Wrench, Factory, Settings } from "lucide-react";
import { ManufacturingCard } from "./ManufacturingCard";
import { LabScript } from "@/types/labScript";

interface StatsCardsProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  scripts: LabScript[];
}

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

export const StatsCards = ({ selectedType, setSelectedType, scripts }: StatsCardsProps) => {
  const getCount = (type: string) => {
    const [source, manufacturingType] = type.split('_');
    return scripts.filter(script => 
      script.manufacturingSource?.toLowerCase() === source && 
      script.manufacturingType?.toLowerCase() === manufacturingType
    ).length;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card) => (
        <ManufacturingCard
          key={card.title}
          title={card.title}
          count={getCount(card.type)}
          icon={card.icon}
          color={card.color}
          bgColor={card.bgColor}
          progressColor={card.progressColor}
          scripts={scripts}
          isActive={selectedType === card.type}
          onClick={() => setSelectedType(selectedType === card.type ? null : card.type)}
        />
      ))}
    </div>
  );
};