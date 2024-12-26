import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { StatusCardProgress } from "./StatusCardProgress";

type StatusCardProps = {
  title: string;
  count: number;
  total: number;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  isActive: boolean;
};

export const StatusCard = ({ 
  title, 
  count, 
  total,
  icon: Icon, 
  color, 
  onClick, 
  isActive 
}: StatusCardProps) => (
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
    <StatusCardProgress count={count} total={total} />
  </Card>
);