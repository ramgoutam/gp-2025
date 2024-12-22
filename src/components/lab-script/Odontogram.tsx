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
  // Define different tooth shapes based on position
  const molarPath = "M -7,-8 C -7,-8 -7,-2 -7,-2 C -7,-2 -3,3 0,3 C 3,3 7,-2 7,-2 C 7,-2 7,-8 7,-8 C 7,-8 4,-10 0,-10 C -4,-10 -7,-8 -7,-8 Z";
  const premolarPath = "M -6,-8 C -6,-8 -6,-2 -6,-2 C -6,-2 -2,2 0,2 C 2,2 6,-2 6,-2 C 6,-2 6,-8 6,-8 C 6,-8 3,-9 0,-9 C -3,-9 -6,-8 -6,-8 Z";
  const anteriorPath = "M -5,-8 C -5,-8 -4,-2 -4,-2 C -4,-2 -2,2 0,2 C 2,2 4,-2 4,-2 C 4,-2 5,-8 5,-8 C 5,-8 2.5,-10 0,-10 C -2.5,-10 -5,-8 -5,-8 Z";
  
  // Define teeth numbers and positions along the arch
  const teethNumbers = isUpper 
    ? [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
    : [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const getToothPath = (index: number) => {
    // Molars: positions 0-2 and 13-15 (wisdom teeth and molars)
    if (index <= 2 || index >= 13) return molarPath;
    // Premolars: positions 3-4 and 11-12
    if (index <= 4 || index >= 11) return premolarPath;
    // Anterior teeth (canines and incisors): positions 5-10
    return anteriorPath;
  };

  // Calculate positions along an arc
  const getToothPosition = (index: number, total: number) => {
    const archWidth = 180; // Increased width for better spacing
    const archHeight = isUpper ? 70 : -70; // Increased height for more pronounced curve
    const angleStep = Math.PI / (total - 1);
    const angle = index * angleStep;
    
    // Adjust x position to create more natural spacing
    const x = (archWidth / 2) * Math.cos(angle) - (archWidth / 2);
    // Adjust y position to create more natural arch
    const y = archHeight * Math.sin(angle) + (isUpper ? 25 : -25);
    
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
            pathD={getToothPath(index)}
            transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}
          />
        );
      })}
    </svg>
  );
};