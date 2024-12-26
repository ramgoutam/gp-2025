import { useSpring, animated } from "@react-spring/web";

export const AnimatedNumber = ({ number }: { number: number }) => {
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