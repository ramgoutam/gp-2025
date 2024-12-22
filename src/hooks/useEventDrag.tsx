import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface DragState {
  eventId: string;
  initialY: number;
  currentY: number;
  initialX: number;
  currentX: number;
  element: HTMLElement;
}

export const useEventDrag = (updateEvent: (id: string, startTime: string, endTime: string) => void) => {
  const [dragState, setDragState] = useState<DragState | null>(null);

  const handleDragStart = (eventId: string, e: React.MouseEvent) => {
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const initialY = e.clientY - rect.top;
    const initialX = e.clientX - rect.left;

    setDragState({
      eventId,
      initialY,
      currentY: e.clientY,
      initialX,
      currentX: e.clientX,
      element
    });

    // Add a class to the body to prevent text selection during drag
    document.body.classList.add('select-none');
    console.log('Event drag started:', { eventId, initialY, initialX });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!dragState) return;

    const deltaY = e.clientY - dragState.currentY;
    dragState.element.style.transform = `translateY(${deltaY}px)`;

    setDragState({
      ...dragState,
      currentY: e.clientY,
      currentX: e.clientX
    });

    console.log('Event being dragged:', { 
      eventId: dragState.eventId,
      currentY: e.clientY,
      currentX: e.clientX 
    });
  };

  const handleDragEnd = (
    e: MouseEvent, 
    getTimeFromY: (y: number) => { hour: number; minutes: number }
  ) => {
    if (!dragState) return;

    // Reset the transform
    dragState.element.style.transform = '';
    document.body.classList.remove('select-none');

    const deltaY = e.clientY - dragState.currentY;
    const newPosition = getTimeFromY(e.clientY - dragState.initialY);
    
    // Format the new time
    const newStartTime = `${newPosition.hour}:${newPosition.minutes.toString().padStart(2, '0')}`;
    
    // Calculate end time (maintain same duration)
    const durationInMinutes = 30; // Default to 30 min if needed
    const newEndMinutes = newPosition.minutes + durationInMinutes;
    const newEndHour = newPosition.hour + Math.floor(newEndMinutes / 60);
    const adjustedEndMinutes = newEndMinutes % 60;
    const newEndTime = `${newEndHour}:${adjustedEndMinutes.toString().padStart(2, '0')}`;

    updateEvent(dragState.eventId, newStartTime, newEndTime);
    setDragState(null);
    toast.success('Event time updated');

    console.log('Event drag ended:', {
      eventId: dragState.eventId,
      newStartTime,
      newEndTime,
      deltaY
    });
  };

  useEffect(() => {
    if (dragState) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
      const handleMouseUp = (e: MouseEvent) => {
        const getTimeFromY = (y: number) => {
          const hour = Math.floor(y / 64) + 6; // 6 is the starting hour
          const minutes = Math.round((y % 64) / (64 / 60) / 30) * 30;
          return { hour, minutes };
        };
        handleDragEnd(e, getTimeFromY);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState]);

  return {
    dragState,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
};