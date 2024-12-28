import { Card } from "@/components/ui/card";
import { useSpring, animated } from "@react-spring/web";
import { LucideIcon } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ManufacturingCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  progressColor: string;
  scripts: LabScript[];
  isActive?: boolean;
  onClick?: () => void;
}

const AnimatedNumber = ({ number }: { number: number }) => {
  const { number: animatedNumber } = useSpring({
    from: { number: 0 },
    number: number,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return <animated.span>{animatedNumber.to(n => Math.floor(n))}</animated.span>;
};

export const ManufacturingCard = ({ 
  title, 
  count, 
  icon: Icon,
  color,
  bgColor,
  progressColor,
  scripts,
  isActive = false,
  onClick
}: ManufacturingCardProps) => {
  const width = useSpring({
    from: { width: '0%' },
    to: { width: '100%' },
    delay: 300,
    config: { tension: 60, friction: 15 }
  });

  // Get the first script to check its status and patient info
  const firstScript = scripts[0];
  
  const getStatusBadge = () => {
    if (!firstScript) return null;

    return (
      <Badge 
        variant="outline" 
        className="bg-blue-100 text-blue-800 border-blue-200"
      >
        {firstScript.patientFirstName} {firstScript.patientLastName}
      </Badge>
    );
  };

  return (
    <Card 
      className={cn(
        "relative p-4 hover:shadow-lg transition-all duration-300 group animate-fade-in cursor-pointer",
        isActive && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">
            <AnimatedNumber number={count} />
          </p>
        </div>
      </div>
      
      <div className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>
          {getStatusBadge()}
        </div>
        <div className="relative h-2.5 rounded-full overflow-hidden bg-gray-100">
          <animated.div
            className={`absolute inset-y-0 left-0 ${progressColor}`}
            style={width}
          />
        </div>
      </div>
    </Card>
  );
};