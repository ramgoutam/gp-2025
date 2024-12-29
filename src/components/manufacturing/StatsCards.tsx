import { Printer, Wrench, Factory, Settings, CheckCircle } from "lucide-react";
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
  },
  {
    title: "Completed Inhouse Printing",
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    progressColor: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    type: "completed_inhouse_printing"
  },
  {
    title: "Completed Inhouse Milling",
    icon: CheckCircle,
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    progressColor: "bg-gradient-to-r from-teal-400 to-teal-500",
    type: "completed_inhouse_milling"
  },
  {
    title: "Completed Outsource Printing",
    icon: CheckCircle,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    progressColor: "bg-gradient-to-r from-cyan-400 to-cyan-500",
    type: "completed_outsource_printing"
  },
  {
    title: "Completed Outsource Milling",
    icon: CheckCircle,
    color: "text-sky-500",
    bgColor: "bg-sky-50",
    progressColor: "bg-gradient-to-r from-sky-400 to-sky-500",
    type: "completed_outsource_milling"
  }
];

export const StatsCards = ({ selectedType, setSelectedType, scripts }: StatsCardsProps) => {
  const getCount = (type: string) => {
    const [status, source, manufacturingType] = type.split('_');
    return scripts.filter(script => {
      const matchesType = script.manufacturingSource?.toLowerCase() === source && 
                         script.manufacturingType?.toLowerCase() === manufacturingType;
      
      if (status === 'completed') {
        // Check manufacturing logs for completed status
        const manufacturingLog = script.manufacturingLogs?.[0];
        return matchesType && manufacturingLog?.manufacturing_status === 'completed';
      } else {
        // For non-completed cards, show items that aren't completed
        const manufacturingLog = script.manufacturingLogs?.[0];
        return matchesType && manufacturingLog?.manufacturing_status !== 'completed';
      }
    }).length;
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