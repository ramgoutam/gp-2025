import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, Files, AlertTriangle } from "lucide-react";
import { StatusCard } from "../scripts/StatusCard";

type ReportStatusCardsProps = {
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
};

export const ReportStatusCards = ({ onFilterChange, activeFilter }: ReportStatusCardsProps) => {
  const { data: reportCounts = { 
    pending: 0, 
    completed: 0,
    incomplete: 0,
    total: 0 
  } } = useQuery({
    queryKey: ['reportStatusCounts'],
    queryFn: async () => {
      console.log('Fetching report status counts');
      
      const { data: reports, error } = await supabase
        .from('report_cards')
        .select('status, design_info_status, clinical_info_status');

      if (error) {
        console.error("Error fetching report counts:", error);
        throw error;
      }

      const pending = reports.filter(r => r.status === 'pending').length;
      const completed = reports.filter(r => r.status === 'completed').length;
      const incomplete = reports.filter(r => 
        r.design_info_status === 'pending' || 
        r.clinical_info_status === 'pending'
      ).length;

      return {
        pending,
        completed,
        incomplete,
        total: reports.length
      };
    },
    refetchInterval: 1000
  });

  const handleCardClick = (status: string | null) => {
    onFilterChange(activeFilter === status ? null : status);
  };

  const cards = [
    {
      title: "Pending Reports",
      count: reportCounts.pending,
      icon: Clock,
      color: "bg-amber-50",
      iconColor: "text-amber-500",
      progressColor: "bg-gradient-to-r from-amber-400 to-amber-500",
      status: 'pending'
    },
    {
      title: "Incomplete Reports",
      count: reportCounts.incomplete,
      icon: AlertTriangle,
      color: "bg-orange-50",
      iconColor: "text-orange-500",
      progressColor: "bg-gradient-to-r from-orange-400 to-orange-500",
      status: 'incomplete'
    },
    {
      title: "Completed Reports",
      count: reportCounts.completed,
      icon: CheckCircle2,
      color: "bg-green-50",
      iconColor: "text-green-500",
      progressColor: "bg-gradient-to-r from-green-400 to-green-500",
      status: 'completed'
    },
    {
      title: "All Reports",
      count: reportCounts.total,
      icon: Files,
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      progressColor: "bg-gradient-to-r from-purple-400 to-purple-500",
      status: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
      {cards.map((card, index) => (
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
            onClick={() => handleCardClick(card.status)}
            isActive={activeFilter === card.status}
          />
        </div>
      ))}
    </div>
  );
};