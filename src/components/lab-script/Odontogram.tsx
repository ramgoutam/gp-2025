import React from "react";
import { cn } from "@/lib/utils";

interface ToothProps {
  number: number;
  selected: boolean;
  onClick: () => void;
  pathD: string;
  transform?: string;
}

const Tooth = ({ number, selected, onClick, pathD, transform }: ToothProps) => (
  <g
    onClick={onClick}
    className={cn(
      "cursor-pointer transition-colors",
      selected ? "fill-primary stroke-primary-foreground" : "fill-white stroke-gray-400 hover:fill-accent"
    )}
    transform={transform}
  >
    <path d={pathD} strokeWidth="1.5" />
    <text
      x="0"
      y="0"
      className={cn(
        "text-[8px] pointer-events-none select-none",
        selected ? "fill-primary-foreground" : "fill-gray-600"
      )}
      textAnchor="middle"
      transform="translate(0, 2)"
    >
      {number}
    </text>
  </g>
);

interface OdontogramProps {
  selectedTeeth: number[];
  onToothClick: (toothNumber: number) => void;
  isUpper?: boolean;
}

export const Odontogram = ({ selectedTeeth, onToothClick, isUpper = true }: OdontogramProps) => {
  // Basic tooth shape - molar-like
  const toothPath = "M -6,-8 C -6,-8 -6,-2 -6,-2 C -6,-2 -2,2 0,2 C 2,2 6,-2 6,-2 C 6,-2 6,-8 6,-8 C 6,-8 0,-10 0,-10 C 0,-10 -6,-8 -6,-8 Z";
  
  // Define teeth numbers and positions along the arch
  const teethNumbers = isUpper 
    ? [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
    : [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  // Calculate positions along an arc
  const getToothPosition = (index: number, total: number) => {
    const archWidth = 160; // Width of the arch
    const archHeight = isUpper ? 60 : -60; // Height/curve of the arch
    const angleStep = Math.PI / (total - 1);
    const angle = index * angleStep;
    
    const x = (archWidth / 2) * Math.cos(angle) - (archWidth / 2);
    const y = archHeight * Math.sin(angle) + (isUpper ? 20 : -20);
    
    // Calculate rotation angle to make teeth follow the arch curve
    const rotation = isUpper 
      ? (index / (total - 1)) * -180 + 90
      : (index / (total - 1)) * 180 - 90;

    return { x, y, rotation };
  };

  return (
    <svg
      viewBox="-100 -60 200 120"
      className="w-full h-auto"
      style={{ maxWidth: '400px' }}
    >
      {teethNumbers.map((number, index) => {
        const pos = getToothPosition(index, teethNumbers.length);
        return (
          <Tooth
            key={number}
            number={number}
            selected={selectedTeeth.includes(number)}
            onClick={() => onToothClick(number)}
            pathD={toothPath}
            transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}
          />
        );
      })}
    </svg>
  );
};