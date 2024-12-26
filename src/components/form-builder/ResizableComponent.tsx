import React, { useState } from 'react';
import { ResizeHandle } from './ResizeHandle';
import { FormComponent } from "@/types/formBuilder";

interface ResizableComponentProps {
  component: FormComponent;
  onUpdateComponent: (updatedComponent: FormComponent) => void;
  children: React.ReactNode;
}

export const ResizableComponent = ({ component, onUpdateComponent, children }: ResizableComponentProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const handleResizeStart = (e: React.MouseEvent, direction: 'right' | 'bottom' | 'bottom-right') => {
    e.preventDefault();
    const element = e.currentTarget.parentElement as HTMLElement;
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({
      width: element.offsetWidth,
      height: element.offsetHeight
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      if (direction === 'right' || direction === 'bottom-right') {
        newWidth = Math.max(100, startSize.width + deltaX);
      }
      if (direction === 'bottom' || direction === 'bottom-right') {
        newHeight = Math.max(40, startSize.height + deltaY);
      }

      onUpdateComponent({
        ...component,
        style: {
          ...component.style,
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        },
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      className="relative"
      style={{
        width: component.style?.width || '100%',
        height: component.style?.height,
      }}
    >
      {children}
      <ResizeHandle position="right" onResize={(e) => handleResizeStart(e, 'right')} />
      <ResizeHandle position="bottom" onResize={(e) => handleResizeStart(e, 'bottom')} />
      <ResizeHandle position="bottom-right" onResize={(e) => handleResizeStart(e, 'bottom-right')} />
    </div>
  );
};