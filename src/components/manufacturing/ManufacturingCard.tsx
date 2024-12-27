import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpring, animated } from "@react-spring/web";
import { LucideIcon } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface ManufacturingCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  progressColor: string;
  scripts: LabScript[];
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
  scripts
}: ManufacturingCardProps) => {
  const width = useSpring({
    from: { width: '0%' },
    to: { width: '100%' },
    delay: 300,
    config: { tension: 60, friction: 15 }
  });

  return (
    <Card className="relative p-6 hover:shadow-lg transition-all duration-300 group animate-fade-in">
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
      
      <div className="space-y-2">
        <p className="text-sm text-gray-500 font-medium">
          {title}
        </p>
        <div className="relative h-2 rounded-full overflow-hidden bg-gray-100">
          <animated.div
            className={`absolute inset-y-0 left-0 ${progressColor}`}
            style={width}
          />
        </div>
      </div>

      <ScrollArea className="h-[140px] mt-3">
        <div className="space-y-2">
          {scripts.map((script) => (
            <div 
              key={script.id} 
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">#{script.request_number}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  script.status === 'completed' ? 'bg-green-100 text-green-800' :
                  script.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {script.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Dr. {script.doctor_name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Due: {new Date(script.due_date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};