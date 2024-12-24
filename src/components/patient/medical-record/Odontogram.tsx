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
        className="hover:fill-gray-100 cursor-pointer transition-colors"
      />
      <text
        x="0"
        y="25"
        textAnchor="middle"
        fontSize="10"
        fill="#4B5563"
      >
        {number}
      </text>
    </g>
  );
};

export const Odontogram = () => {
  // Define tooth shapes based on the provided image
  const molarPath = "M -15,-15 L 15,-15 C 20,-15 20,15 15,15 L -15,15 C -20,15 -20,-15 -15,-15 Z M 0,0 L -5,-5 M 0,0 L 5,-5 M 0,0 L -5,5 M 0,0 L 5,5";
  const premolarPath = "M -12,-12 L 12,-12 C 16,-12 16,12 12,12 L -12,12 C -16,12 -16,-12 -12,-12 Z M 0,0 L -4,-4 M 0,0 L 4,-4 M 0,0 L -4,4 M 0,0 L 4,4";
  const anteriorPath = "M -10,-12 L 10,-12 C 14,-12 14,12 10,12 L -10,12 C -14,12 -14,-12 -10,-12 Z";

  // Upper teeth positions (1-16) following a natural arch curve
  const upperTeeth = [
    { number: 1, type: 'molar', x: 40, y: 40 },
    { number: 2, type: 'molar', x: 70, y: 45 },
    { number: 3, type: 'premolar', x: 95, y: 55 },
    { number: 4, type: 'premolar', x: 115, y: 70 },
    { number: 5, type: 'premolar', x: 130, y: 90 },
    { number: 6, type: 'anterior', x: 140, y: 110 },
    { number: 7, type: 'anterior', x: 145, y: 130 },
    { number: 8, type: 'anterior', x: 148, y: 150 },
    { number: 9, type: 'anterior', x: 232, y: 150 },
    { number: 10, type: 'anterior', x: 235, y: 130 },
    { number: 11, type: 'anterior', x: 240, y: 110 },
    { number: 12, type: 'premolar', x: 250, y: 90 },
    { number: 13, type: 'premolar', x: 265, y: 70 },
    { number: 14, type: 'premolar', x: 285, y: 55 },
    { number: 15, type: 'molar', x: 310, y: 45 },
    { number: 16, type: 'molar', x: 340, y: 40 }
  ];

  // Lower teeth positions (17-32) following a natural arch curve
  const lowerTeeth = [
    { number: 32, type: 'molar', x: 40, y: 340 },
    { number: 31, type: 'molar', x: 70, y: 335 },
    { number: 30, type: 'premolar', x: 95, y: 325 },
    { number: 29, type: 'premolar', x: 115, y: 310 },
    { number: 28, type: 'premolar', x: 130, y: 290 },
    { number: 27, type: 'anterior', x: 140, y: 270 },
    { number: 26, type: 'anterior', x: 145, y: 250 },
    { number: 25, type: 'anterior', x: 148, y: 230 },
    { number: 24, type: 'anterior', x: 232, y: 230 },
    { number: 23, type: 'anterior', x: 235, y: 250 },
    { number: 22, type: 'anterior', x: 240, y: 270 },
    { number: 21, type: 'premolar', x: 250, y: 290 },
    { number: 20, type: 'premolar', x: 265, y: 310 },
    { number: 19, type: 'premolar', x: 285, y: 325 },
    { number: 18, type: 'molar', x: 310, y: 335 },
    { number: 17, type: 'molar', x: 340, y: 340 }
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
        viewBox="0 0 380 380"
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