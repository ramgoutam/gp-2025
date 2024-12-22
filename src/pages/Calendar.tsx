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
  
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6);
  const categories = ["lab", "followup", "emergency", "surgery", "dentist"] as const;

  const categoryLabels = {
    lab: "Lab Schedule",
    followup: "Follow Up",
    emergency: "Emergency",
    surgery: "Surgery",
    dentist: "Dentist Calendar"
  };

  const handleDragStart = (e: React.MouseEvent, hour: number, category: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = Math.floor((y / 64) * 60);
    const time = `${hour}:${minutes.toString().padStart(2, '0')}`;
    
    setIsDragging(true);
    setDragStart({ time, category });
  };

  const handleDragEnd = (e: React.MouseEvent, hour: number) => {
    if (!dragStart) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = Math.floor((y / 64) * 60);
    const endTime = `${hour}:${minutes.toString().padStart(2, '0')}`;

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
    toast.success("New appointment slot created");
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
    
    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;
    
    return ((endInMinutes - startInMinutes) / 60) * 64;
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
                        onMouseUp={(e) => handleDragEnd(e, hour)}
                      />
                    ))}

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