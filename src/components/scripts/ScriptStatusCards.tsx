import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Clock, Loader2, CheckCircle2, Files, PauseCircle, StopCircle, AlertTriangle } from "lucide-react";
import { useSpring, animated } from "@react-spring/web";

type StatusCardProps = {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  isActive: boolean;
};

const AnimatedNumber = ({ number }: { number: number }) => {
  const { number: animatedNumber } = useSpring({
    from: { number: 0 },
    number: number,
    delay: 50,
    config: { 
      mass: 1, 
      tension: 170,
      friction: 26
    }
  });

  return (
    <animated.span>
      {animatedNumber.to(n => Math.floor(n))}
    </animated.span>
  );
};

const StatusCard = ({ title, count, icon: Icon, color, onClick, isActive }: StatusCardProps) => (
  <Card 
    className={`
      p-6 
      cursor-pointer 
      transition-all 
      duration-300 
      hover:shadow-xl
      hover:-translate-y-2
      ${isActive ? 'ring-2 ring-primary-500 shadow-lg' : ''}
      animate-fade-in
      relative
      overflow-hidden
      group
      bg-gradient-to-br from-white to-gray-50
      dark:from-gray-900 dark:to-gray-800
      backdrop-blur-sm
      border border-gray-100/20
      dark:border-gray-700/20
    `}
    onClick={onClick}
  >
    {/* Shine effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 transform -skew-x-12 opacity-0 group-hover:opacity-100" />
    
    <div className="flex items-start justify-between relative">
      <div className={`
        p-3 
        rounded-xl 
        ${color} 
        bg-opacity-10
        transition-all 
        duration-500 
        group-hover:scale-110
        group-hover:rotate-6
        group-hover:shadow-lg
        backdrop-blur-sm
      `}>
        <Icon className={`
          w-6 
          h-6 
          transition-all 
          duration-500 
          group-hover:rotate-12
          ${color.replace('bg-', 'text-')}
        `} />
      </div>
      <div className="text-right space-y-1">
        <p className={`
          text-3xl 
          font-bold 
          mb-2 
          transition-colors 
          duration-300 
          group-hover:text-primary-500
          bg-clip-text
          ${isActive ? 'text-primary-500' : 'text-gray-800 dark:text-gray-100'}
        `}>
          <AnimatedNumber number={count} />
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
          {title}
        </p>
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

      const pending = scripts.filter(s => s.status === 'pending').length;
      const inProcess = scripts.filter(s => s.status === 'in_progress').length;
      const completed = scripts.filter(s => s.status === 'completed').length;
      const paused = scripts.filter(s => s.status === 'paused').length;
      const hold = scripts.filter(s => s.status === 'hold').length;
      
      // Update incomplete count to include pending, in_progress, paused, and hold statuses
      const incomplete = pending + inProcess + paused + hold;

      const counts = {
        pending,
        inProcess,
        completed,
        paused,
        hold,
        incomplete,
        total: scripts.length
      };

      console.log('Script counts:', counts);
      return counts;
    },
    refetchInterval: 500 // Reduced to 500ms for quicker updates
  });

  const handleCardClick = (status: string | null) => {
    onFilterChange(activeFilter === status ? null : status);
  };

  return (
    <div className="grid grid-cols-7 gap-4 mb-6 animate-fade-in">
      <StatusCard
        title="Pending"
        count={scriptCounts.pending}
        icon={Clock}
        color="bg-amber-500"
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