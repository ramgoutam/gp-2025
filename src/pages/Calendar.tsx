import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DateSelector } from "@/components/calendar/DateSelector";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { EventCard } from "@/components/calendar/EventCard";

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
  
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6);
  const categories = ["lab", "followup", "emergency", "surgery", "dentist"] as const;

  const categoryLabels = {
    lab: "Lab Schedule",
    followup: "Follow Up",
    emergency: "Emergency",
    surgery: "Surgery",
    dentist: "Dentist Calendar"
  };

  const categoryColors = {
    lab: {
      button: "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90",
      event: "bg-blue-50/80 border-blue-200"
    },
    followup: {
      button: "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90",
      event: "bg-purple-50/80 border-purple-200"
    },
    emergency: {
      button: "bg-[#D946EF] hover:bg-[#D946EF]/90",
      event: "bg-pink-50/80 border-pink-200"
    },
    surgery: {
      button: "bg-[#F97316] hover:bg-[#F97316]/90",
      event: "bg-orange-50/80 border-orange-200"
    },
    dentist: {
      button: "bg-[#06B6D4] hover:bg-[#06B6D4]/90",
      event: "bg-cyan-50/80 border-cyan-200"
    }
  };

  const handleAddEvent = (category: Event['category']) => {
    console.log(`Adding event for category: ${category}`);
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
          {/* Calendar Header */}
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

          {/* Calendar Grid */}
          <div className="relative bg-white rounded-b-xl">
            <TimeGrid timeSlots={timeSlots} />

            {/* Category columns */}
            <div className="ml-14 grid grid-cols-5 gap-px bg-gray-100">
              {categories.map((category) => (
                <div key={category} className="bg-white">
                  <div className="px-3 py-3 text-sm font-medium text-gray-700 border-b bg-gray-50/50 sticky top-[57px] z-10">
                    <div className="flex items-center justify-between">
                      <span>{categoryLabels[category]}</span>
                      <Button 
                        className={`${categoryColors[category].button} text-white h-7 w-7 p-0 shadow-sm hover:shadow-md transition-all`}
                        size="icon"
                        onClick={() => handleAddEvent(category)}
                        title={`Add ${categoryLabels[category]}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative bg-white">
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="border-t border-gray-100 h-16"
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