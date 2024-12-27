import { Card } from "@/components/ui/card";
import { Printer, CircuitBoard, Factory, Cog } from "lucide-react";
import { useSpring, animated } from "@react-spring/web";

const AnimatedNumber = ({ number }: { number: number }) => {
  const { number: animatedNumber } = useSpring({
    from: { number: 0 },
    number: number,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return <animated.span>{animatedNumber.to(n => Math.floor(n))}</animated.span>;
};

const ManufacturingCard = ({ 
  title, 
  count, 
  icon: Icon,
  color,
  bgColor,
  progressColor
}: {
  title: string;
  count: number;
  icon: any;
  color: string;
  bgColor: string;
  progressColor: string;
}) => {
  const width = useSpring({
    from: { width: '0%' },
    to: { width: '100%' },
    delay: 300,
    config: { tension: 60, friction: 15 }
  });

  return (
    <Card className="relative p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-fade-in">
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
    </Card>
  );
};

const Manufacturing = () => {
  const cards = [
    {
      title: "Inhouse Printing",
      count: 24,
      icon: Printer,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-500"
    },
    {
      title: "Inhouse Milling",
      count: 18,
      icon: CircuitBoard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progressColor: "bg-purple-500"
    },
    {
      title: "Outsource Printing",
      count: 12,
      icon: Factory,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500"
    },
    {
      title: "Outsource Milling",
      count: 15,
      icon: Cog,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progressColor: "bg-green-500"
    }
  ];

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">Manufacturing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <ManufacturingCard
            key={card.title}
            {...card}
          />
        ))}
      </div>
    </div>
  );
};

export default Manufacturing;