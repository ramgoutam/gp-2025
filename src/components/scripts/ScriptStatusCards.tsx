import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Clock, Loader2, CheckCircle2, Files } from "lucide-react";

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
    className={`p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
      isActive ? 'ring-2 ring-primary shadow-lg' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-2">{count}</p>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
);

type ScriptStatusCardsProps = {
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
};

export const ScriptStatusCards = ({ onFilterChange, activeFilter }: ScriptStatusCardsProps) => {
  const { data: scriptCounts = { pending: 0, inProcess: 0, completed: 0, total: 0 } } = useQuery({
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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