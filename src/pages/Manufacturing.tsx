import { Card } from "@/components/ui/card";
import { Printer, CircuitBoard, Factory, Cog } from "lucide-react";
import { useSpring, animated } from "@react-spring/web";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LabScript {
  id: string;
  request_number: string;
  doctor_name: string;
  manufacturing_source: string;
  manufacturing_type: string;
  due_date: string;
  status: string;
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

const ManufacturingCard = ({ 
  title, 
  count, 
  icon: Icon,
  color,
  bgColor,
  progressColor,
  scripts
}: {
  title: string;
  count: number;
  icon: any;
  color: string;
  bgColor: string;
  progressColor: string;
  scripts: LabScript[];
}) => {
  const width = useSpring({
    from: { width: '0%' },
    to: { width: '100%' },
    delay: 300,
    config: { tension: 60, friction: 15 }
  });

  return (
    <Card className="relative p-4 hover:shadow-lg transition-all duration-300 group animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className={`${bgColor} w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedNumber number={count} />
          </p>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-medium">
          {title}
        </p>
        <div className="relative h-1 rounded-full overflow-hidden bg-gray-100">
          <animated.div
            className={`absolute inset-y-0 left-0 ${progressColor}`}
            style={width}
          />
        </div>
      </div>

      <ScrollArea className="h-[120px] mt-2">
        <div className="space-y-1">
          {scripts.map((script) => (
            <div 
              key={script.id} 
              className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs">#{script.request_number}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  script.status === 'completed' ? 'bg-green-100 text-green-800' :
                  script.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {script.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">Dr. {script.doctor_name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Due: {new Date(script.due_date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

const Manufacturing = () => {
  const { data: manufacturingData = {
    counts: {
      inhousePrinting: 0,
      inhouseMilling: 0,
      outsourcePrinting: 0,
      outsourceMilling: 0,
      total: 0
    },
    scripts: []
  }} = useQuery({
    queryKey: ['manufacturingData'],
    queryFn: async () => {
      console.log('Fetching manufacturing data');
      
      const { data: scripts, error } = await supabase
        .from('lab_scripts')
        .select('id, request_number, doctor_name, manufacturing_source, manufacturing_type, due_date, status');

      if (error) {
        console.error("Error fetching manufacturing data:", error);
        throw error;
      }

      const inhousePrinting = scripts.filter(s => 
        s.manufacturing_source === 'inhouse' && s.manufacturing_type === 'printing'
      );

      const inhouseMilling = scripts.filter(s => 
        s.manufacturing_source === 'inhouse' && s.manufacturing_type === 'milling'
      );

      const outsourcePrinting = scripts.filter(s => 
        s.manufacturing_source === 'outsource' && s.manufacturing_type === 'printing'
      );

      const outsourceMilling = scripts.filter(s => 
        s.manufacturing_source === 'outsource' && s.manufacturing_type === 'milling'
      );

      return {
        counts: {
          inhousePrinting: inhousePrinting.length,
          inhouseMilling: inhouseMilling.length,
          outsourcePrinting: outsourcePrinting.length,
          outsourceMilling: outsourceMilling.length,
          total: scripts.length
        },
        scripts
      };
    },
    refetchInterval: 1000
  });

  const cards = [
    {
      title: "Inhouse Printing",
      count: manufacturingData.counts.inhousePrinting,
      icon: Printer,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturing_source === 'inhouse' && s.manufacturing_type === 'printing'
      )
    },
    {
      title: "Inhouse Milling",
      count: manufacturingData.counts.inhouseMilling,
      icon: CircuitBoard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progressColor: "bg-purple-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturing_source === 'inhouse' && s.manufacturing_type === 'milling'
      )
    },
    {
      title: "Outsource Printing",
      count: manufacturingData.counts.outsourcePrinting,
      icon: Factory,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturing_source === 'outsource' && s.manufacturing_type === 'printing'
      )
    },
    {
      title: "Outsource Milling",
      count: manufacturingData.counts.outsourceMilling,
      icon: Cog,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progressColor: "bg-green-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturing_source === 'outsource' && s.manufacturing_type === 'milling'
      )
    }
  ];

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 animate-fade-in">Manufacturing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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