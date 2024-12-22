import React from "react";
import { cn } from "@/lib/utils";

interface ToothProps {
  number: number;
  selected: boolean;
  onClick: () => void;
}

const Tooth = ({ number, selected, onClick }: ToothProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-8 h-8 border rounded-sm text-xs flex items-center justify-center transition-colors",
      selected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
    )}
  >
    {number}
  </button>
);

interface OdontogramProps {
  selectedTeeth: number[];
  onToothClick: (toothNumber: number) => void;
  isUpper?: boolean;
}

export const Odontogram = ({ selectedTeeth, onToothClick, isUpper = true }: OdontogramProps) => {
  // Define teeth numbers based on whether it's upper or lower
  const teethNumbers = isUpper ? [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28] 
                               : [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <div className="grid grid-cols-8 gap-1">
      {teethNumbers.map((number) => (
        <Tooth
          key={number}
          number={number}
          selected={selectedTeeth.includes(number)}
          onClick={() => onToothClick(number)}
        />
      ))}
    </div>
  );
};