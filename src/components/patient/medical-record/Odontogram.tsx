import React from "react";

interface ToothProps {
  number: number;
  x: number;
  y: number;
  rotation?: number;
}

const Tooth: React.FC<ToothProps> = ({ number, x, y, rotation = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <path
        d="M0,0 Q5,-5 10,0 Q15,-5 20,0 Q20,5 20,15 Q15,20 10,15 Q5,20 0,15 Q0,5 0,0 Z"
        fill="#E5E7EB"
        stroke="#9CA3AF"
        strokeWidth="1"
      />
      <text
        x="10"
        y="12"
        textAnchor="middle"
        fontSize="8"
        fill="#4B5563"
      >
        {number}
      </text>
    </g>
  );
};

export const Odontogram = () => {
  // Define tooth positions in a curve
  const upperTeeth = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI * (i - 7.5)) / 16;
    const radius = 100;
    return {
      number: i + 1,
      x: 150 + radius * Math.sin(angle),
      y: 100 - radius * Math.cos(angle),
      rotation: (angle * 180) / Math.PI
    };
  });

  const lowerTeeth = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI * (i + 8.5)) / 16;
    const radius = 100;
    return {
      number: 32 - i,
      x: 150 + radius * Math.sin(angle),
      y: 100 - radius * Math.cos(angle),
      rotation: (angle * 180) / Math.PI + 180
    };
  });

  return (
    <div className="w-full aspect-square max-w-md mx-auto">
      <svg
        viewBox="0 0 300 200"
        className="w-full h-full"
      >
        {upperTeeth.map((tooth) => (
          <Tooth
            key={tooth.number}
            number={tooth.number}
            x={tooth.x}
            y={tooth.y}
            rotation={tooth.rotation}
          />
        ))}
        {lowerTeeth.map((tooth) => (
          <Tooth
            key={tooth.number}
            number={tooth.number}
            x={tooth.x}
            y={tooth.y}
            rotation={tooth.rotation}
          />
        ))}
      </svg>
    </div>
  );
};