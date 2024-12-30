import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Factory, CheckCircle2 } from "lucide-react";
import { StatusCard } from "@/components/scripts/StatusCard";

export const ManufacturingCards = () => {
  const { data: manufacturingCounts = {
    manufacturing: 0,
    sintering: 0,
    miyo: 0,
    inspection: 0,
    total: 0
  } } = useQuery({
    queryKey: ['manufacturingStatusCounts'],
    queryFn: async () => {
      console.log('Fetching manufacturing status counts for dashboard');
      
      const { data: logs, error } = await supabase
        .from('manufacturing_logs')
        .select('*');

      if (error) {
        console.error("Error fetching manufacturing counts:", error);
        throw error;
      }

      const manufacturing = logs.filter(l => l.manufacturing_status === 'in_progress').length;
      const sintering = logs.filter(l => l.sintering_status === 'in_progress').length;
      const miyo = logs.filter(l => l.miyo_status === 'in_progress').length;
      const inspection = logs.filter(l => l.inspection_status === 'in_progress').length;

      return {
        manufacturing,
        sintering,
        miyo,
        inspection,
        total: logs.length
      };
    },
    refetchInterval: 1000
  });

  const manufacturingCards = [
    {
      title: "Manufacturing",
      count: manufacturingCounts.manufacturing,
      icon: Factory,
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      progressColor: "bg-gradient-to-r from-purple-400 to-purple-500"
    },
    {
      title: "Sintering",
      count: manufacturingCounts.sintering,
      icon: Factory,
      color: "bg-indigo-50",
      iconColor: "text-indigo-500",
      progressColor: "bg-gradient-to-r from-indigo-400 to-indigo-500"
    },
    {
      title: "Miyo",
      count: manufacturingCounts.miyo,
      icon: Factory,
      color: "bg-pink-50",
      iconColor: "text-pink-500",
      progressColor: "bg-gradient-to-r from-pink-400 to-pink-500"
    },
    {
      title: "Inspection",
      count: manufacturingCounts.inspection,
      icon: CheckCircle2,
      color: "bg-cyan-50",
      iconColor: "text-cyan-500",
      progressColor: "bg-gradient-to-r from-cyan-400 to-cyan-500"
    }
  ];

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-left">Manufacturing</h2>
      <div className="grid grid-cols-2 gap-4 animate-fade-in">
        {manufacturingCards.map((card, index) => (
          <div
            key={card.title}
            className="animate-fade-in"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <StatusCard
              title={card.title}
              count={card.count}
              icon={card.icon}
              color={card.color}
              iconColor={card.iconColor}
              progressColor={card.progressColor}
              onClick={() => {}}
              isActive={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};