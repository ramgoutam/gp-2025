import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DateSelector } from "@/components/calendar/DateSelector";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { EventCard } from "@/components/calendar/EventCard";
import { toast } from "sonner";
import { snapToHalfHour, formatTime, calculatePosition, calculateHeight } from "@/utils/calendarUtils";
import { useEventDrag } from "@/hooks/useEventDrag";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: { name: string; avatar?: string }[];
  category: "lab" | "followup" | "emergency" | "surgery" | "dentist";
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ time: string; category: string } | null>(null);
  const [previewEvent, setPreviewEvent] = useState<{
    startTime: string;
    endTime: string;
    category: string;
  } | null>(null);

  const updateEventTime = (id: string, newStartTime: string, newEndTime: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id 
          ? { ...event, startTime: newStartTime, endTime: newEndTime }
          : event
      )
    );
  };

  const { dragState, handleDragStart, handleDragMove: handleExistingEventDragMove, handleDragEnd: handleExistingEventDragEnd } = useEventDrag(updateEventTime);

  useEffect(() => {
    if (dragState) {
      const handleMouseMove = (e: MouseEvent) => handleExistingEventDragMove(e);
      const handleMouseUp = (e: MouseEvent) => {
        const getTimeFromY = (y: number) => {
          const hour = Math.floor(y / 64) + 6; // 6 is the starting hour
          const minutes = Math.round((y % 64) / (64 / 60) / 30) * 30;
          return { hour, minutes };
        };
        handleExistingEventDragEnd(e, getTimeFromY);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleExistingEventDragMove, handleExistingEventDragEnd]);
  
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6);
  const categories = ["lab", "followup", "emergency", "surgery", "dentist"] as const;

  const categoryLabels = {
    lab: "Lab Schedule",
    followup: "Follow Up",
    emergency: "Emergency",
    surgery: "Surgery",
    dentist: "Dentist Calendar"
  };

  const handleNewEventDragStart = (e: React.MouseEvent, hour: number, category: string) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const rawMinutes = Math.floor((y / 64) * 60);
    
    const snapped = snapToHalfHour(hour, rawMinutes);
    const time = formatTime(snapped.hour, snapped.minutes);
    
    setIsDragging(true);
    setDragStart({ time, category });
    setPreviewEvent({
      startTime: time,
      endTime: time,
      category
    });

    console.log('New event drag started:', { time, category });
  };

  const handleNewEventDragMove = (e: React.MouseEvent, hour: number) => {
    if (!isDragging || !dragStart || !previewEvent) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const rawMinutes = Math.floor((y / 64) * 60);
    
    const snapped = snapToHalfHour(hour, rawMinutes);
    const currentTime = formatTime(snapped.hour, snapped.minutes);

    const [startHour, startMinute] = dragStart.time.split(':').map(Number);
    const [endHour, endMinute] = currentTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const finalEndTime = endTotalMinutes < startTotalMinutes ? dragStart.time : currentTime;

    setPreviewEvent({
      ...previewEvent,
      endTime: finalEndTime
    });

    console.log('New event drag move:', { startTime: dragStart.time, endTime: finalEndTime });
  };

  const handleNewEventDragEnd = (e: React.MouseEvent, hour: number) => {
    if (!isDragging || !dragStart || !previewEvent) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const rawMinutes = Math.floor((y / 64) * 60);
    
    const snapped = snapToHalfHour(hour, rawMinutes);
    const endTime = formatTime(snapped.hour, snapped.minutes);

    const [startHour, startMinute] = dragStart.time.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const finalEndTime = endTotalMinutes < startTotalMinutes ? dragStart.time : endTime;

    const newEvent: Event = {
      id: crypto.randomUUID(),
      title: "New Appointment",
      startTime: dragStart.time,
      endTime: finalEndTime,
      attendees: [],
      category: dragStart.category as Event['category']
    };

    setEvents(prev => [...prev, newEvent]);
    setIsDragging(false);
    setDragStart(null);
    setPreviewEvent(null);
    toast.success("New appointment slot created");

    console.log('New event created:', newEvent);
  };

  const navigateDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      
      <main className="container mx-auto py-6">
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

            <div className="ml-14 grid grid-cols-5 gap-px bg-gray-100">
              {categories.map((category) => (
                <div key={category} className="bg-white">
                  <div className="px-3 py-3 text-sm font-medium text-gray-700 border-b bg-gray-50/50 sticky top-[57px] z-10">
                    <div className="flex items-center justify-between">
                      <span>{categoryLabels[category]}</span>
                    </div>
                  </div>
                  <div className="relative bg-white">
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="border-t border-gray-100 h-16 relative"
                        onMouseDown={(e) => handleNewEventDragStart(e, hour, category)}
                        onMouseMove={(e) => handleNewEventDragMove(e, hour)}
                        onMouseUp={(e) => handleNewEventDragEnd(e, hour)}
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
                      .map((event) => (
                        <div
                          key={event.id}
                          className="absolute left-1 right-1"
                          style={{
                            top: `${calculatePosition(event.startTime)}px`,
                            height: `${calculateHeight(event.startTime, event.endTime)}px`,
                            minHeight: '32px'
                          }}
                        >
                          <EventCard 
                            {...event} 
                            category={event.category}
                            onDragStart={handleDragStart}
                          />
                        </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}