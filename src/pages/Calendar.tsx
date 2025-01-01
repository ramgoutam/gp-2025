import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DateSelector } from "@/components/calendar/DateSelector";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { CalendarColumn } from "@/components/calendar/CalendarColumn";
import { useEventDrag } from "@/hooks/useEventDrag";
import { Event } from "@/types/calendar";

const categoryLabels = {
  lab: "Lab Schedule",
  followup: "Follow Up",
  emergency: "Emergency",
  surgery: "Surgery",
  dentist: "Dentist Calendar",
  consultation: "Consultations"
} as const;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6);
  const categories = ["lab", "followup", "emergency", "surgery", "dentist", "consultation"] as const;

  const updateEventTime = (id: string, newStartTime: string, newEndTime: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id 
          ? { ...event, startTime: newStartTime, endTime: newEndTime }
          : event
      )
    );
  };

  const {
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
  } = useEventDrag(updateEventTime);

  const navigateDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <Card className="bg-white border-0 shadow-lg rounded-xl relative z-10">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20 rounded-t-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
            <DateSelector 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onNavigateDay={navigateDay}
            />
          </div>
        </div>

        <div className="relative bg-white rounded-b-xl">
          <TimeGrid timeSlots={timeSlots} />

          <div className="ml-14 grid grid-cols-6 gap-px bg-gray-100">
            {categories.map((category) => (
              <CalendarColumn
                key={category}
                category={category}
                categoryLabel={categoryLabels[category]}
                timeSlots={timeSlots}
                events={events}
                onDragStart={handleDragStart}
                onNewEventDragStart={handleNewEventDragStart}
                onNewEventDragMove={handleNewEventDragMove}
                onNewEventDragEnd={handleNewEventDragEnd}
                dragState={dragState}
                isDragging={isDragging}
                dragStart={dragStart}
                previewEvent={previewEvent}
                calculatePosition={calculatePosition}
                calculateHeight={calculateHeight}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}