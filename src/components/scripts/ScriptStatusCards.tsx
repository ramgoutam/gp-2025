import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Clock, Loader2, CheckCircle2, Files, PauseCircle, StopCircle, AlertTriangle } from "lucide-react";

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
    className={`
      p-4 
      cursor-pointer 
      transition-all 
      duration-300 
      hover:shadow-lg
      hover:-translate-y-1
      ${isActive ? 'ring-2 ring-primary shadow-lg' : ''}
      animate-fade-in
      relative
      overflow-hidden
      group
    `}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 transform -skew-x-12 opacity-0 group-hover:opacity-100" />
    <div className="flex items-start justify-between relative">
      <div className={`
        p-2 
        rounded-lg 
        ${color} 
        bg-opacity-10
        transition-transform 
        duration-300 
        group-hover:scale-110
      `}>
        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" 
              style={{ color: color.replace('bg-', 'text-') }} />
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold mb-1 transition-colors group-hover:text-primary">{count}</p>
        <p className="text-sm text-gray-500 transition-colors group-hover:text-gray-700">{title}</p>
      </div>
    </div>
  </Card>
);

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

      const counts = {
        pending: scripts.filter(s => s.status === 'pending').length,
        inProcess: scripts.filter(s => s.status === 'in_progress').length,
        completed: scripts.filter(s => s.status === 'completed').length,
        paused: scripts.filter(s => s.status === 'paused').length,
        hold: scripts.filter(s => s.status === 'hold').length,
        incomplete: scripts.filter(s => s.status === 'incomplete').length,
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
    <div className="grid grid-cols-7 gap-4 mb-6">
      <StatusCard
        title="Pending"
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
        icon={PauseCircle}
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
        icon={AlertTriangle}
        color="bg-purple-500"
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
        color="bg-gray-500"
        onClick={() => handleCardClick(null)}
        isActive={activeFilter === null}
      />
    </div>
  );
};