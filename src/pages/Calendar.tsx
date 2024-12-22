import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DateSelector } from "@/components/calendar/DateSelector";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { EventCard } from "@/components/calendar/EventCard";
import { toast } from "sonner";

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
  
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6);
  const categories = ["lab", "followup", "emergency", "surgery", "dentist"] as const;

  const categoryLabels = {
    lab: "Lab Schedule",
    followup: "Follow Up",
    emergency: "Emergency",
    surgery: "Surgery",
    dentist: "Dentist Calendar"
  };

  const snapToHalfHour = (hour: number, minutes: number) => {
    const roundedMinutes = Math.round(minutes / 30) * 30;
    
    let adjustedHour = hour;
    let adjustedMinutes = roundedMinutes;
    
    if (roundedMinutes === 60) {
      adjustedHour += 1;
      adjustedMinutes = 0;
    }
    
    return {
      hour: adjustedHour,
      minutes: adjustedMinutes
    };
  };

  const formatTime = (hour: number, minutes: number) => {
    return `${hour}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (e: React.MouseEvent, hour: number, category: string) => {
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

    console.log('Drag started:', { time, category });
  };

  const handleDragMove = (e: React.MouseEvent, hour: number) => {
    if (!isDragging || !dragStart || !previewEvent) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const rawMinutes = Math.floor((y / 64) * 60);
    
    const snapped = snapToHalfHour(hour, rawMinutes);
    const currentTime = formatTime(snapped.hour, snapped.minutes);

    setPreviewEvent({
      ...previewEvent,
      endTime: currentTime
    });
  };

  const handleDragEnd = (e: React.MouseEvent, hour: number) => {
    if (!isDragging || !dragStart) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const rawMinutes = Math.floor((y / 64) * 60);
    
    const snapped = snapToHalfHour(hour, rawMinutes);
    const endTime = formatTime(snapped.hour, snapped.minutes);

    const newEvent: Event = {
      id: crypto.randomUUID(),
      title: "New Appointment",
      startTime: dragStart.time,
      endTime,
      attendees: [],
      category: dragStart.category as Event['category']
    };

    setEvents(prev => [...prev, newEvent]);
    setIsDragging(false);
    setDragStart(null);
    setPreviewEvent(null);
    toast.success("New appointment slot created");

    console.log('Event created:', newEvent);
  };

  const navigateDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const calculatePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const baseHour = 6;
    return ((hours - baseHour) * 64) + ((minutes / 60) * 64);
  };

  const calculateHeight = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const totalStartMinutes = (startHours * 60) + startMinutes;
    const totalEndMinutes = (endHours * 60) + endMinutes;
    const diffInMinutes = totalEndMinutes - totalStartMinutes;
    
    return (diffInMinutes / 60) * 64;
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
                        onMouseDown={(e) => handleDragStart(e, hour, category)}
                        onMouseMove={(e) => handleDragMove(e, hour)}
                        onMouseUp={(e) => handleDragEnd(e, hour)}
                      />
                    ))}

                    {/* Preview event while dragging */}
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
                          <EventCard {...event} category={event.category} />
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
