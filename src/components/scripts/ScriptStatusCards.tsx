import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Clock, Loader2, CheckCircle2, Files, Pause, StopCircle, AlertCircle } from "lucide-react";

type StatusCardProps = {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  isActive: boolean;
};

const StatusCard = ({ title, count, icon: Icon, color, onClick, isActive }: StatusCardProps) => (
  <Card 
    className={`p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
      isActive ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
          {count}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className={`h-1.5 rounded-full ${color} bg-opacity-15 w-full`}>
          <div 
            className={`h-1.5 rounded-full ${color} transition-all duration-500`} 
            style={{ width: `${(count / (count || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  </Card>
);

type ScriptStatusCardsProps = {
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
};

export const ScriptStatusCards = ({ onFilterChange, activeFilter }: ScriptStatusCardsProps) => {
  const { data: scriptCounts = { pending: 0, inProcess: 0, paused: 0, hold: 0, incomplete: 0, completed: 0, total: 0 } } = useQuery({
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

      const counts = {
        pending: scripts.filter(s => s.status === 'pending').length,
        inProcess: scripts.filter(s => s.status === 'in_progress').length,
        paused: scripts.filter(s => s.status === 'paused').length,
        hold: scripts.filter(s => s.status === 'hold').length,
        incomplete: scripts.filter(s => s.status === 'incomplete').length,
        completed: scripts.filter(s => s.status === 'completed').length,
        total: scripts.length
      };

      console.log('Script counts:', counts);
      return counts;
    },
    refetchInterval: 1000
  });

  const handleCardClick = (status: string | null) => {
    onFilterChange(activeFilter === status ? null : status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
      <StatusCard
        title="Pending Scripts"
        count={scriptCounts.pending}
        icon={Clock}
        color="bg-yellow-500"
        onClick={() => handleCardClick('pending')}
        isActive={activeFilter === 'pending'}
      />
      <StatusCard
        title="In Process"
        count={scriptCounts.inProcess}
        icon={Loader2}
        color="bg-blue-500"
        onClick={() => handleCardClick('in_progress')}
        isActive={activeFilter === 'in_progress'}
      />
      <StatusCard
        title="Paused"
        count={scriptCounts.paused}
        icon={Pause}
        color="bg-orange-500"
        onClick={() => handleCardClick('paused')}
        isActive={activeFilter === 'paused'}
      />
      <StatusCard
        title="On Hold"
        count={scriptCounts.hold}
        icon={StopCircle}
        color="bg-red-500"
        onClick={() => handleCardClick('hold')}
        isActive={activeFilter === 'hold'}
      />
      <StatusCard
        title="Incomplete"
        count={scriptCounts.incomplete}
        icon={AlertCircle}
        color="bg-rose-500"
        onClick={() => handleCardClick('incomplete')}
        isActive={activeFilter === 'incomplete'}
      />
      <StatusCard
        title="Completed"
        count={scriptCounts.completed}
        icon={CheckCircle2}
        color="bg-green-500"
        onClick={() => handleCardClick('completed')}
        isActive={activeFilter === 'completed'}
      />
      <StatusCard
        title="All Scripts"
        count={scriptCounts.total}
        icon={Files}
        color="bg-purple-500"
        onClick={() => handleCardClick(null)}
        isActive={activeFilter === null}
      />
    </div>
  );
};