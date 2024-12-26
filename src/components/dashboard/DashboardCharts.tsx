import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, Loader2, PauseCircle, StopCircle } from 'lucide-react';

export const DashboardCharts = () => {
  const { data: scriptCounts = { 
    pending: 0, 
    in_progress: 0, 
    completed: 0, 
    paused: 0,
    hold: 0,
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
      const total = scripts.length;

      return {
        pending,
        in_progress: inProcess,
        completed,
        paused,
        hold,
        total
      };
    },
    refetchInterval: 1000
  });

  const statusCards = [
    {
      title: "Pending Scripts",
      count: scriptCounts.pending,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      title: "In Progress",
      count: scriptCounts.in_progress,
      icon: Loader2,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Completed",
      count: scriptCounts.completed,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Paused",
      count: scriptCounts.paused,
      icon: PauseCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: "On Hold",
      count: scriptCounts.hold,
      icon: StopCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in">
      {statusCards.map((card, index) => (
        <Card 
          key={card.title}
          className={`relative overflow-hidden border ${card.borderColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{card.count}</p>
                <p className="text-xs text-gray-500">Total Scripts</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${card.bgColor} transition-all duration-1000 ease-in-out`}
                style={{ 
                  width: `${(card.count / (scriptCounts.total || 1)) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};