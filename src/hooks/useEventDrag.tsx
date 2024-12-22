import { useState } from 'react';
import { toast } from 'sonner';

interface DragState {
  eventId: string;
  initialY: number;
  currentY: number;
}

export const useEventDrag = (updateEvent: (id: string, startTime: string, endTime: string) => void) => {
  const [dragState, setDragState] = useState<DragState | null>(null);

  const handleDragStart = (eventId: string, e: React.MouseEvent) => {
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const initialY = e.clientY - rect.top;

    setDragState({
      eventId,
      initialY,
      currentY: e.clientY
    });

    console.log('Event drag started:', { eventId, initialY });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!dragState) return;

    setDragState({
      ...dragState,
      currentY: e.clientY
    });

    console.log('Event being dragged:', { 
      eventId: dragState.eventId,
      currentY: e.clientY 
    });
  };

  const handleDragEnd = (
    e: MouseEvent, 
    getTimeFromY: (y: number) => { hour: number; minutes: number }
  ) => {
    if (!dragState) return;

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

  return {
    dragState,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
};