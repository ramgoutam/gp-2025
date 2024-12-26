import { useSpring, animated } from "@react-spring/web";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export const StatusCardProgress = ({ count, total }: { count: number; total: number }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    setProgress(percentage);
  }, [count, total]);

  const props = useSpring({
    width: `${progress}%`,
    from: { width: '0%' },
    config: { 
      tension: 170,
      friction: 26
    }
  });

  return (
    <div className="mt-4">
      <Progress value={progress} className="h-1 bg-gray-100 dark:bg-gray-700">
        <animated.div
          className="h-full bg-gradient-to-r from-primary-300 via-primary-500 to-primary-600 rounded-full shadow-lg shadow-primary-500/20 animate-shimmer"
          style={props}
        />
      </Progress>
    </div>
  );
};