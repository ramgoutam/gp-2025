import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Loader2, CheckCircle2, Files, PauseCircle, StopCircle, AlertTriangle } from "lucide-react";
import { StatusCard } from "./StatusCard";

type ScriptStatusCardsProps = {
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
};

export const ScriptStatusCards = ({ onFilterChange, activeFilter }: ScriptStatusCardsProps) => {
  const { data: scriptCounts = { 
    pending: 0, 
    inProcess: 0, 
    completed: 0, 
    paused: 0,
    hold: 0,
    incomplete: 0,
    total: 0 
  } } = useQuery({
    queryKey: ['scriptStatusCounts'],
    queryFn: async () => {
      console.log('Fetching script status counts');
      
      const { data: scripts, error } = await supabase
        .from('lab_scripts')
        .select('status');

      if (error) {
        console.error("Error fetching script counts:", error);
        throw error;
      }

      const pending = scripts.filter(s => s.status === 'pending').length;
      const inProcess = scripts.filter(s => s.status === 'in_progress').length;
      const completed = scripts.filter(s => s.status === 'completed').length;
      const paused = scripts.filter(s => s.status === 'paused').length;
      const hold = scripts.filter(s => s.status === 'hold').length;
      const incomplete = pending + inProcess + paused + hold;

      return {
        pending,
        inProcess,
        completed,
        paused,
        hold,
        incomplete,
        total: scripts.length
      };
    },
    refetchInterval: 500
  });

  const handleCardClick = (status: string | null) => {
    onFilterChange(activeFilter === status ? null : status);
  };

  const cards = [
    {
      title: "New Lab Scripts",
      count: scriptCounts.pending,
      icon: Clock,
      color: "bg-amber-50",
      iconColor: "text-amber-500",
      progressColor: "bg-gradient-to-r from-amber-400 to-amber-500",
      status: 'pending'
    },
    {
      title: "In Process",
      count: scriptCounts.inProcess,
      icon: Loader2,
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      progressColor: "bg-gradient-to-r from-blue-400 to-blue-500",
      status: 'in_progress'
    },
    {
      title: "Paused",
      count: scriptCounts.paused,
      icon: PauseCircle,
      color: "bg-orange-50",
      iconColor: "text-orange-500",
      progressColor: "bg-gradient-to-r from-orange-400 to-orange-500",
      status: 'paused'
    },
    {
      title: "On Hold",
      count: scriptCounts.hold,
      icon: StopCircle,
      color: "bg-red-50",
      iconColor: "text-red-500",
      progressColor: "bg-gradient-to-r from-red-400 to-red-500",
      status: 'hold'
    },
    {
      title: "Incomplete",
      count: scriptCounts.incomplete,
      icon: AlertTriangle,
      color: "bg-pink-50",
      iconColor: "text-pink-500",
      progressColor: "bg-gradient-to-r from-pink-400 to-pink-500",
      status: 'incomplete'
    },
    {
      title: "Completed",
      count: scriptCounts.completed,
      icon: CheckCircle2,
      color: "bg-green-50",
      iconColor: "text-green-500",
      progressColor: "bg-gradient-to-r from-green-400 to-green-500",
      status: 'completed'
    },
    {
      title: "All Scripts",
      count: scriptCounts.total,
      icon: Files,
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      progressColor: "bg-gradient-to-r from-purple-400 to-purple-500",
      status: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6 animate-fade-in">
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