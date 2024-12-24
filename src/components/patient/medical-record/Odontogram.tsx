import React from "react";

interface ToothProps {
  number: number;
  d: string;
  transform?: string;
}

const Tooth: React.FC<ToothProps> = ({ number, d, transform }) => {
  return (
    <g transform={transform}>
      <path
        d={d}
        fill="white"
        stroke="#374151"
        strokeWidth="1"
        className="hover:fill-gray-100 transition-colors"
      />
      <text
        x="0"
        y="0"
        textAnchor="middle"
        fontSize="8"
        fill="#4B5563"
        transform="translate(0, 2)"
      >
        {number}
      </text>
    </g>
  );
};

export const Odontogram = () => {
  // Define tooth shapes for different positions
  const molarPath = "M -10,-7 C -8,-8 8,-8 10,-7 C 12,-6 12,6 10,7 C 8,8 -8,8 -10,7 C -12,6 -12,-6 -10,-7 Z";
  const premolarPath = "M -8,-6 C -6,-7 6,-7 8,-6 C 10,-5 10,5 8,6 C 6,7 -6,7 -8,6 C -10,5 -10,-5 -8,-6 Z";
  const anteriorPath = "M -6,-7 C -4,-8 4,-8 6,-7 C 8,-6 8,6 6,7 C 4,8 -4,8 -6,7 C -8,6 -8,-6 -6,-7 Z";

  // Upper teeth positions (1-16)
  const upperTeeth = [
    { number: 1, type: 'molar', x: 40, y: 40 },
    { number: 2, type: 'molar', x: 60, y: 45 },
    { number: 3, type: 'premolar', x: 80, y: 50 },
    { number: 4, type: 'premolar', x: 100, y: 55 },
    { number: 5, type: 'premolar', x: 120, y: 60 },
    { number: 6, type: 'anterior', x: 140, y: 65 },
    { number: 7, type: 'anterior', x: 160, y: 67 },
    { number: 8, type: 'anterior', x: 180, y: 68 },
    { number: 9, type: 'anterior', x: 200, y: 68 },
    { number: 10, type: 'anterior', x: 220, y: 67 },
    { number: 11, type: 'anterior', x: 240, y: 65 },
    { number: 12, type: 'premolar', x: 260, y: 60 },
    { number: 13, type: 'premolar', x: 280, y: 55 },
    { number: 14, type: 'premolar', x: 300, y: 50 },
    { number: 15, type: 'molar', x: 320, y: 45 },
    { number: 16, type: 'molar', x: 340, y: 40 }
  ];

  // Lower teeth positions (17-32)
  const lowerTeeth = [
    { number: 32, type: 'molar', x: 40, y: 160 },
    { number: 31, type: 'molar', x: 60, y: 155 },
    { number: 30, type: 'premolar', x: 80, y: 150 },
    { number: 29, type: 'premolar', x: 100, y: 145 },
    { number: 28, type: 'premolar', x: 120, y: 140 },
    { number: 27, type: 'anterior', x: 140, y: 135 },
    { number: 26, type: 'anterior', x: 160, y: 133 },
    { number: 25, type: 'anterior', x: 180, y: 132 },
    { number: 24, type: 'anterior', x: 200, y: 132 },
    { number: 23, type: 'anterior', x: 220, y: 133 },
    { number: 22, type: 'anterior', x: 240, y: 135 },
    { number: 21, type: 'premolar', x: 260, y: 140 },
    { number: 20, type: 'premolar', x: 280, y: 145 },
    { number: 19, type: 'premolar', x: 300, y: 150 },
    { number: 18, type: 'molar', x: 320, y: 155 },
    { number: 17, type: 'molar', x: 340, y: 160 }
  ];

  const getToothPath = (type: string) => {
    switch (type) {
      case 'molar':
        return molarPath;
      case 'premolar':
        return premolarPath;
      case 'anterior':
        return anteriorPath;
      default:
        return anteriorPath;
    }
  };

  return (
    <div className="w-full aspect-square max-w-md mx-auto">
      <svg
        viewBox="0 0 380 200"
        className="w-full h-full"
      >
        {upperTeeth.map((tooth) => (
          <Tooth
            key={tooth.number}
            number={tooth.number}
            d={getToothPath(tooth.type)}
            transform={`translate(${tooth.x}, ${tooth.y})`}
          />
        ))}
        {lowerTeeth.map((tooth) => (
          <Tooth
            key={tooth.number}
            number={tooth.number}
            d={getToothPath(tooth.type)}
            transform={`translate(${tooth.x}, ${tooth.y})`}
          />
        ))}
      </svg>
    </div>
  );
};