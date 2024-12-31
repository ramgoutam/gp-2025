import { Card } from "@/components/ui/card";
import { useSpring, animated } from "@react-spring/web";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type StatusCardProps = {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  onClick: () => void;
  isActive: boolean;
  progressColor: string;
  items?: any[]; // Add items prop for displaying in dialog
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
  iconColor,
  onClick, 
  isActive,
  progressColor,
  items = []
}: StatusCardProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleCardClick = () => {
    onClick();
    setShowDialog(true);
  };

  return (
    <>
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
          backdrop-blur-sm
          hover:bg-opacity-90
        `}
        onClick={handleCardClick}
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
            shadow-sm
            animate-fade-in
          `}>
            <Icon className={`w-6 h-6 ${iconColor} transition-transform duration-300 group-hover:rotate-12`} />
          </div>
          <div className="text-right">
            <p className={`
              text-3xl 
              font-bold 
              ${isActive ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}
              transition-colors
              duration-300
            `}>
              <AnimatedNumber number={count} />
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {title}
          </p>
          <div className="relative h-2.5 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <animated.div
              className={`
                absolute 
                inset-y-0 
                left-0 
                transition-all 
                duration-500
                ${progressColor}
              `}
              style={{
                width: useSpring({
                  from: { width: '0%' },
                  to: { width: '100%' },
                  delay: 100,
                  config: { 
                    tension: 60,
                    friction: 15,
                    clamp: true
                  }
                }).width
              }}
            />
          </div>
        </div>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${iconColor}`} />
              <span>{title}</span>
              <span className="text-sm text-gray-500">({count} items)</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-4 p-4">
              {items.map((item, index) => (
                <Card key={item.id || index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Request #{item.requestNumber || 'N/A'}</p>
                      <p className="text-sm text-gray-500">
                        Patient: {item.patientFirstName} {item.patientLastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Type: {item.applianceType || 'N/A'}</p>
                    </div>
                  </div>
                </Card>
              ))}
              {items.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No items to display
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};