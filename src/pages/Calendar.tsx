import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DateSelector } from "@/components/calendar/DateSelector";
import { TimeGrid } from "@/components/calendar/TimeGrid";
import { EventCard } from "@/components/calendar/EventCard";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: { name: string; avatar?: string }[];
  category: "personal" | "work" | "health" | "other";
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Demo events data
  const events: Event[] = [
    {
      id: "1",
      title: "Kick-off meeting with project team",
      startTime: "6:00",
      endTime: "6:30",
      attendees: [
        { name: "John Doe" },
        { name: "Jane Smith" }
      ],
      category: "work"
    },
    {
      id: "2",
      title: "Gym session",
      startTime: "9:40",
      endTime: "11:30",
      attendees: [
        { name: "Alice Johnson" }
      ],
      category: "health"
    },
    {
      id: "3",
      title: "Family dinner",
      startTime: "18:00",
      endTime: "19:30",
      attendees: [
        { name: "Bob Wilson" },
        { name: "Carol Brown" }
      ],
      category: "personal"
    }
  ];

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6); // 6am to 6pm
  const categories = ["personal", "work", "health", "other"] as const;

  const navigateDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto py-4">
        <Card className="bg-white border shadow-sm relative z-10">
          {/* Calendar Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between bg-white sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-medium text-gray-900">Calendar</h1>
              <DateSelector 
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onNavigateDay={navigateDay}
              />
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="relative bg-white">
            <TimeGrid timeSlots={timeSlots} />

            {/* Category columns */}
            <div className="ml-14 grid grid-cols-4">
              {categories.map((category) => (
                <div key={category} className="border-r border-gray-100">
                  <div className="px-2 py-1 text-sm font-medium text-gray-700 capitalize border-b bg-gray-50 sticky top-[57px] z-10">
                    {category}
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
                            top: `${(parseInt(event.startTime.split(':')[0]) - 6) * 64 + 
                              (parseInt(event.startTime.split(':')[1]) / 60) * 64}px`,
                            height: `${((parseInt(event.endTime.split(':')[0]) * 60 + 
                              parseInt(event.endTime.split(':')[1])) - 
                              (parseInt(event.startTime.split(':')[0]) * 60 + 
                              parseInt(event.startTime.split(':')[1]))) / 60 * 64}px`
                          }}
                        >
                          <EventCard {...event} />
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