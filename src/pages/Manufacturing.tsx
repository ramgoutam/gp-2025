import { Printer, CircuitBoard, Factory, Cog } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Manufacturing = () => {
  const { toast } = useToast();
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

  const handleStatusUpdate = async (script: LabScript, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "The lab script status has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the status. Please try again.",
      });
    }
  };

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
      filter: "inhouse-printing"
    },
    {
      title: "Inhouse Milling",
      count: manufacturingData.counts.inhouseMilling,
      icon: CircuitBoard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progressColor: "bg-purple-500",
      filter: "inhouse-milling"
    },
    {
      title: "Outsource Printing",
      count: manufacturingData.counts.outsourcePrinting,
      icon: Factory,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500",
      filter: "outsource-printing"
    },
    {
      title: "Outsource Milling",
      count: manufacturingData.counts.outsourceMilling,
      icon: Cog,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progressColor: "bg-green-500",
      filter: "outsource-milling"
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
    </div>
  );
};

export default Manufacturing;