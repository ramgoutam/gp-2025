import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Clock, Loader2, PauseCircle, StopCircle, AlertTriangle, CheckCircle2, Files } from "lucide-react";

type StatusCardProps = {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  isActive: boolean;
  iconBgColor: string;
  borderColor: string;
};

const StatusCard = ({ 
  title, 
  count, 
  icon: Icon, 
  color, 
  onClick, 
  isActive,
  iconBgColor,
  borderColor
}: StatusCardProps) => (
  <Card 
    className={`
      p-4 
      cursor-pointer 
      transition-all 
      duration-300 
      hover:-translate-y-1
      ${isActive ? 'ring-2 ring-primary/20 shadow-lg scale-[1.02]' : ''}
      animate-fade-in
      relative
      overflow-hidden
      group
      bg-white
      hover:shadow-lg
      border-b-2 ${borderColor}
    `}
    onClick={onClick}
  >
    <div className="flex items-center justify-between relative">
      <div className="space-y-3">
        <div className={`${iconBgColor} w-10 h-10 rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {title}
          </p>
        </div>
      </div>
      <div className={`text-xl font-semibold ${color}`}>
        {count}
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
        title="Pending Scripts"
        count={scriptCounts.pending}
        icon={Clock}
        color="text-yellow-600"
        iconBgColor="bg-yellow-50"
        borderColor="border-yellow-500"
        onClick={() => handleCardClick('pending')}
        isActive={activeFilter === 'pending'}
      />
      <StatusCard
        title="In Process"
        count={scriptCounts.inProcess}
        icon={Loader2}
        color="text-blue-600"
        iconBgColor="bg-blue-50"
        borderColor="border-blue-500"
        onClick={() => handleCardClick('in_progress')}
        isActive={activeFilter === 'in_progress'}
      />
      <StatusCard
        title="Paused"
        count={scriptCounts.paused}
        icon={PauseCircle}
        color="text-orange-600"
        iconBgColor="bg-orange-50"
        borderColor="border-orange-500"
        onClick={() => handleCardClick('paused')}
        isActive={activeFilter === 'paused'}
      />
      <StatusCard
        title="On Hold"
        count={scriptCounts.hold}
        icon={StopCircle}
        color="text-red-600"
        iconBgColor="bg-red-50"
        borderColor="border-red-500"
        onClick={() => handleCardClick('hold')}
        isActive={activeFilter === 'hold'}
      />
      <StatusCard
        title="Incomplete"
        count={scriptCounts.incomplete}
        icon={AlertTriangle}
        color="text-pink-600"
        iconBgColor="bg-pink-50"
        borderColor="border-pink-500"
        onClick={() => handleCardClick('incomplete')}
        isActive={activeFilter === 'incomplete'}
      />
      <StatusCard
        title="Completed"
        count={scriptCounts.completed}
        icon={CheckCircle2}
        color="text-green-600"
        iconBgColor="bg-green-50"
        borderColor="border-green-500"
        onClick={() => handleCardClick('completed')}
        isActive={activeFilter === 'completed'}
      />
      <StatusCard
        title="All Scripts"
        count={scriptCounts.total}
        icon={Files}
        color="text-purple-600"
        iconBgColor="bg-purple-50"
        borderColor="border-purple-500"
        onClick={() => handleCardClick(null)}
        isActive={activeFilter === null}
      />
    </div>
  );
};