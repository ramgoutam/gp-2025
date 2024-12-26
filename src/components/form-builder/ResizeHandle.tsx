import React from 'react';
import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  position: 'right' | 'bottom' | 'bottom-right';
  onResize: (e: React.MouseEvent) => void;
}

export const ResizeHandle = ({ position, onResize }: ResizeHandleProps) => {
  return (
    <div
      className={cn(
        "absolute bg-primary/20 hover:bg-primary/40 transition-colors",
        position === 'right' && "right-0 top-0 w-1 h-full cursor-ew-resize",
        position === 'bottom' && "bottom-0 left-0 h-1 w-full cursor-ns-resize",
        position === 'bottom-right' && "bottom-0 right-0 w-2 h-2 cursor-nwse-resize rounded-sm"
      )}
      onMouseDown={onResize}
    />
  );
};