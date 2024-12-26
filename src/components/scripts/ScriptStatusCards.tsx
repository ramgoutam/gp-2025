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
      const total = scripts.length;

      const counts = {
        pending,
        inProcess,
        completed,
        paused,
        hold,
        incomplete,
        total
      };

      console.log('Script counts:', counts);
      return counts;
    },
    refetchInterval: 500
  });

  const handleCardClick = (status: string | null) => {
    onFilterChange(activeFilter === status ? null : status);
  };

  return (
    <div className="grid grid-cols-7 gap-4 mb-6 animate-fade-in">
      <StatusCard
        title="Pending"
        count={scriptCounts.pending}
        total={scriptCounts.total}
        icon={Clock}
        color="bg-amber-500"
        onClick={() => handleCardClick('pending')}
        isActive={activeFilter === 'pending'}
      />
      <StatusCard
        title="In Process"
        count={scriptCounts.inProcess}
        total={scriptCounts.total}
        icon={Loader2}
        color="bg-blue-500"
        onClick={() => handleCardClick('in_progress')}
        isActive={activeFilter === 'in_progress'}
      />
      <StatusCard
        title="Paused"
        count={scriptCounts.paused}
        total={scriptCounts.total}
        icon={PauseCircle}
        color="bg-orange-500"
        onClick={() => handleCardClick('paused')}
        isActive={activeFilter === 'paused'}
      />
      <StatusCard
        title="On Hold"
        count={scriptCounts.hold}
        total={scriptCounts.total}
        icon={StopCircle}
        color="bg-red-500"
        onClick={() => handleCardClick('hold')}
        isActive={activeFilter === 'hold'}
      />
      <StatusCard
        title="Incomplete"
        count={scriptCounts.incomplete}
        total={scriptCounts.total}
        icon={AlertTriangle}
        color="bg-purple-500"
        onClick={() => handleCardClick('incomplete')}
        isActive={activeFilter === 'incomplete'}
      />
      <StatusCard
        title="Completed"
        count={scriptCounts.completed}
        total={scriptCounts.total}
        icon={CheckCircle2}
        color="bg-green-500"
        onClick={() => handleCardClick('completed')}
        isActive={activeFilter === 'completed'}
      />
      <StatusCard
        title="All Scripts"
        count={scriptCounts.total}
        total={scriptCounts.total}
        icon={Files}
        color="bg-gray-500"
        onClick={() => handleCardClick(null)}
        isActive={activeFilter === null}
      />
    </div>
  );
};