import { Card } from "@/components/ui/card";
import { useSpring, animated } from "@react-spring/web";

type StatusCardProps = {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  isActive: boolean;
  progressColor: string;
};

const AnimatedNumber = ({ number }: { number: number }) => {
  const { number: animatedNumber } = useSpring({
    from: { number: 0 },
    number: number,
    delay: 50,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  return <animated.span>{animatedNumber.to(n => Math.floor(n))}</animated.span>;
};

export const StatusCard = ({ 
  title, 
  count, 
  icon: Icon, 
  color, 
  onClick, 
  isActive,
  progressColor 
}: StatusCardProps) => (
  <Card
    className={`
      relative 
      cursor-pointer 
      transition-all 
      duration-300
      hover:shadow-lg
      hover:-translate-y-1
      ${isActive ? 'ring-2 ring-primary shadow-lg' : ''}
      overflow-hidden
      bg-white
      dark:bg-gray-800
      p-4
    `}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`
        ${color} 
        w-12 
        h-12 
        rounded-lg 
        flex 
        items-center 
        justify-center
        transition-transform
        duration-300
        hover:scale-110
      `}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-right">
        <p className={`
          text-3xl 
          font-bold 
          ${isActive ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}
        `}>
          <AnimatedNumber number={count} />
        </p>
      </div>
    </div>
    
    <div className="space-y-2">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <div className="relative h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <div
          className={`
            absolute 
            inset-y-0 
            left-0 
            transition-all 
            duration-500
            ${progressColor}
          `}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  </Card>
);