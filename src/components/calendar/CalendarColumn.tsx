import { EventCard } from "./EventCard";
import { Event } from "@/types/calendar";

interface CalendarColumnProps {
  category: "lab" | "followup" | "emergency" | "surgery" | "dentist" | "consultation";
  categoryLabel: string;
  timeSlots: number[];
  events: Event[];
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onNewEventDragStart: (e: React.MouseEvent, hour: number, category: string) => void;
  onNewEventDragMove: (e: React.MouseEvent, hour: number) => void;
  onNewEventDragEnd: (e: React.MouseEvent, hour: number) => void;
  dragState: { eventId: string } | null;
  isDragging: boolean;
  dragStart: { time: string; category: string } | null;
  previewEvent: { startTime: string; endTime: string; category: string } | null;
  calculatePosition: (time: string) => number;
  calculateHeight: (startTime: string, endTime: string) => number;
}

export const CalendarColumn = ({
  category,
  categoryLabel,
  timeSlots,
  events,
  onDragStart,
  onNewEventDragStart,
  onNewEventDragMove,
  onNewEventDragEnd,
  dragState,
  isDragging,
  dragStart,
  previewEvent,
  calculatePosition,
  calculateHeight
}: CalendarColumnProps) => {
  return (
    <div className="bg-white">
      <div className="px-3 py-3 text-sm font-medium text-gray-700 border-b bg-gray-50/50 sticky top-[57px] z-10">
        <div className="flex items-center justify-between">
          <span>{categoryLabel}</span>
        </div>
      </div>
      <div className="relative bg-white">
        {timeSlots.map((hour) => (
          <div
            key={hour}
            className="border-t border-gray-100 h-16 relative"
            onMouseDown={(e) => onNewEventDragStart(e, hour, category)}
            onMouseMove={(e) => onNewEventDragMove(e, hour)}
            onMouseUp={(e) => onNewEventDragEnd(e, hour)}
          />
        ))}

        {isDragging && previewEvent && previewEvent.category === category && (
          <div
            className="absolute left-1 right-1 bg-gray-200/50 border border-gray-300 rounded-lg pointer-events-none"
            style={{
              top: `${calculatePosition(previewEvent.startTime)}px`,
              height: `${calculateHeight(previewEvent.startTime, previewEvent.endTime)}px`,
              minHeight: '32px'
            }}
          />
        )}

        {events
          .filter(event => event.category === category)
          .map((event) => {
            const isBeingDragged = dragState?.eventId === event.id;
            return (
              <div
                key={event.id}
                className={`absolute left-1 right-1 transition-transform ${isBeingDragged ? 'z-50' : ''}`}
                style={{
                  top: `${calculatePosition(event.startTime)}px`,
                  height: `${calculateHeight(event.startTime, event.endTime)}px`,
                  minHeight: '32px',
                }}
              >
                <EventCard 
                  {...event} 
                  category={event.category}
                  onDragStart={onDragStart}
                  isDragging={isBeingDragged}
                />
              </div>
            );
        })}
      </div>
    </div>
  );
};