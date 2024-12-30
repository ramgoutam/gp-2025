import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Loader2, CheckCircle2, Files, PauseCircle, StopCircle, AlertTriangle } from "lucide-react";
import { StatusCard } from "@/components/scripts/StatusCard";

export const LabScriptsCards = () => {
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
      console.log('Fetching script status counts for dashboard');
      
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
    refetchInterval: 1000
  });

  const firstRowCards = [
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
    }
  ];

  const secondRowCards = [
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
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-left">Lab Scripts</h2>
      <div className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-4 gap-4">
          {firstRowCards.map((card, index) => (
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
        <div className="grid grid-cols-3 gap-4">
          {secondRowCards.map((card, index) => (
            <div
              key={card.title}
              className="animate-fade-in"
              style={{
                animationDelay: `${(index + 4) * 100}ms`
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
    </div>
  );
};