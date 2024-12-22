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
  category: "lab" | "followup" | "emergency" | "surgery" | "dentist";
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Demo events data
  const events: Event[] = [
    {
      id: "1",
      title: "Dental Checkup",
      startTime: "6:00",
      endTime: "6:30",
      attendees: [
        { name: "John Doe" },
        { name: "Jane Smith" }
      ],
      category: "dentist"
    },
    {
      id: "2",
      title: "Emergency Consultation",
      startTime: "9:40",
      endTime: "11:30",
      attendees: [
        { name: "Alice Johnson" }
      ],
      category: "emergency"
    },
    {
      id: "3",
      title: "Lab Work Review",
      startTime: "18:00",
      endTime: "19:30",
      attendees: [
        { name: "Bob Wilson" },
        { name: "Carol Brown" }
      ],
      category: "lab"
    }
  ];

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6); // 6am to 6pm
  const categories = ["lab", "followup", "emergency", "surgery", "dentist"] as const;

  const categoryLabels = {
    lab: "Lab Schedule",
    followup: "Follow Up",
    emergency: "Emergency",
    surgery: "Surgery",
    dentist: "Dentist Calendar"
  };

  const categoryColors = {
    lab: "bg-blue-50 border-blue-100",
    followup: "bg-purple-50 border-purple-100",
    emergency: "bg-red-50 border-red-100",
    surgery: "bg-green-50 border-green-100",
    dentist: "bg-amber-50 border-amber-100"
  };

  const navigateDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const calculatePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const baseHour = 6; // Starting hour (6 AM)
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
            <div className="ml-14 grid grid-cols-5">
              {categories.map((category) => (
                <div key={category} className="border-r border-gray-100">
                  <div className="px-2 py-1 text-sm font-medium text-gray-700 capitalize border-b bg-gray-50 sticky top-[57px] z-10">
                    {categoryLabels[category]}
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