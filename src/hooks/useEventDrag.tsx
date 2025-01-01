import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface DragState {
  eventId: string;
  initialY: number;
  currentY: number;
  initialX: number;
  currentX: number;
  element: HTMLElement;
}

interface PreviewEvent {
  startTime: string;
  endTime: string;
  category: string;
}

export const useEventDrag = (updateEvent: (id: string, startTime: string, endTime: string) => void) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ time: string; category: string } | null>(null);
  const [previewEvent, setPreviewEvent] = useState<PreviewEvent | null>(null);

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
    setIsDragging(true);

    document.body.classList.add('select-none');
  };

  const handleNewEventDragStart = (e: React.MouseEvent, hour: number, category: string) => {
    setDragStart({
      time: `${hour}:00`,
      category
    });
    setIsDragging(true);
  };

  const handleNewEventDragMove = (e: React.MouseEvent, hour: number) => {
    if (dragStart) {
      setPreviewEvent({
        startTime: dragStart.time,
        endTime: `${hour + 1}:00`,
        category: dragStart.category
      });
    }
  };

  const handleNewEventDragEnd = (e: React.MouseEvent, hour: number) => {
    setIsDragging(false);
    setDragStart(null);
    setPreviewEvent(null);
  };

  const calculatePosition = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours - 9) * 64 + (minutes / 60) * 64;
  };

  const calculateHeight = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const start = startHours + startMinutes / 60;
    const end = endHours + endMinutes / 60;
    return (end - start) * 64;
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
  };

  const handleDragEnd = (e: MouseEvent) => {
    if (!dragState) return;

    dragState.element.style.transform = '';
    document.body.classList.remove('select-none');

    const getTimeFromY = (y: number) => {
      const hour = Math.floor(y / 64) + 9;
      const minutes = Math.round((y % 64) / (64 / 60) / 30) * 30;
      return { hour, minutes };
    };

    const newPosition = getTimeFromY(e.clientY - dragState.initialY);
    const newStartTime = `${newPosition.hour}:${newPosition.minutes.toString().padStart(2, '0')}`;
    const durationInMinutes = 30;
    const newEndMinutes = newPosition.minutes + durationInMinutes;
    const newEndHour = newPosition.hour + Math.floor(newEndMinutes / 60);
    const adjustedEndMinutes = newEndMinutes % 60;
    const newEndTime = `${newEndHour}:${adjustedEndMinutes.toString().padStart(2, '0')}`;

    updateEvent(dragState.eventId, newStartTime, newEndTime);
    setDragState(null);
    setIsDragging(false);
    toast({
      title: "Event updated",
      description: `Event time updated to ${newStartTime} - ${newEndTime}`
    });
  };

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragState]);

  return {
    dragState,
    isDragging,
    dragStart,
    previewEvent,
    handleDragStart,
    handleNewEventDragStart,
    handleNewEventDragMove,
    handleNewEventDragEnd,
    calculatePosition,
    calculateHeight
  };
};