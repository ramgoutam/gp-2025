import { Card } from "@/components/ui/card";
import { useSpring, animated } from "@react-spring/web";
import { LucideIcon } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

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
  onStart?: () => void;
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
  onClick,
  onStart
}: ManufacturingCardProps) => {
  const width = useSpring({
    from: { width: '0%' },
    to: { width: '100%' },
    delay: 300,
    config: { tension: 60, friction: 15 }
  });

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
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={(e) => {
            e.stopPropagation();
            onStart?.();
          }}
        >
          <Play className="w-4 h-4 mr-2" />
          Start
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>
        </div>
        <div className="relative h-2.5 rounded-full overflow-hidden bg-gray-100">
          <animated.div
            className={`absolute inset-y-0 left-0 ${progressColor}`}
            style={width}
          />
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          <AnimatedNumber number={count} />
        </p>
      </div>
    </Card>
  );
};