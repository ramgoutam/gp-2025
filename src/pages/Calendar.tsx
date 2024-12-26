import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DateSelector } from "@/components/calendar/DateSelector";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { CalendarColumn } from "@/components/calendar/CalendarColumn";
import { toast } from "sonner";
import { snapToHalfHour, formatTime, calculatePosition, calculateHeight } from "@/utils/calendarUtils";
import { useEventDrag } from "@/hooks/useEventDrag";
import { Event } from "@/types/calendar";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const categoryLabels = {
  lab: "Lab Schedule",
  followup: "Follow Up",
  emergency: "Emergency",
  surgery: "Surgery",
  dentist: "Dentist Calendar"
} as const;

export default function Calendar() {
  const [session, setSession] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ time: string; category: string } | null>(null);
  const [previewEvent, setPreviewEvent] = useState<{
    startTime: string;
    endTime: string;
    category: string;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateEventTime = (id: string, newStartTime: string, newEndTime: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id 
          ? { ...event, startTime: newStartTime, endTime: newEndTime }
          : event
      )
    );
  };

  const { dragState, handleDragStart, handleDragMove, handleDragEnd } = useEventDrag(updateEventTime);

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6);
  const categories = ["lab", "followup", "emergency", "surgery", "dentist"] as const;

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
  };

  const navigateDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation session={session} />
      
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
      </main>
    </div>
  );
}
