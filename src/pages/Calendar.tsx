import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Demo events data with categories
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentDate(date);
    }
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const navigateDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const categories = ["personal", "work", "health", "other"] as const;
  const categoryColors = {
    personal: "bg-blue-50 border-blue-100",
    work: "bg-purple-50 border-purple-100",
    health: "bg-green-50 border-green-100",
    other: "bg-gray-50 border-gray-100"
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto py-4">
        <Card className="bg-white border-0 shadow-none">
          {/* Calendar Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-medium text-gray-900">Calendar</h1>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigateDay(-1)}
                >
                  Yesterday
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={navigateToToday}
                >
                  Today
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateDay(1)}
                >
                  Tomorrow
                </Button>
                <span className="text-sm text-gray-600 ml-2">
                  {formatDate(currentDate)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Event
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="relative">
            {/* Time slots */}
            <div className="absolute top-0 left-0 w-14 h-full border-r border-gray-100">
              {timeSlots.map((hour) => (
                <div 
                  key={hour} 
                  className="flex items-start justify-end pr-2 h-16 -mt-2 text-xs text-gray-500"
                >
                  {`${hour}:00`}
                </div>
              ))}
            </div>

            {/* Category columns */}
            <div className="ml-14 grid grid-cols-4">
              {categories.map((category) => (
                <div key={category} className="border-r border-gray-100">
                  <div className="px-2 py-1 text-sm font-medium text-gray-700 capitalize border-b bg-gray-50">
                    {category}
                  </div>
                  {/* Time grid lines */}
                  <div className="relative">
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="border-t border-gray-100 h-16"
                      />
                    ))}

                    {/* Events for this category */}
                    {events
                      .filter(event => event.category === category)
                      .map((event) => (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 p-2 rounded ${categoryColors[event.category]} hover:brightness-95 transition-all cursor-pointer`}
                          style={{
                            top: `${(parseInt(event.startTime.split(':')[0]) - 6) * 64 + 
                              (parseInt(event.startTime.split(':')[1]) / 60) * 64}px`,
                            height: `${((parseInt(event.endTime.split(':')[0]) * 60 + 
                              parseInt(event.endTime.split(':')[1])) - 
                              (parseInt(event.startTime.split(':')[0]) * 60 + 
                              parseInt(event.startTime.split(':')[1]))) / 60 * 64}px`
                          }}
                        >
                          <div className="flex flex-col h-full">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {event.title}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {event.startTime} - {event.endTime}
                            </p>
                            <div className="flex -space-x-2 mt-1">
                              {event.attendees.map((attendee, index) => (
                                <Avatar key={index} className="h-6 w-6 border-2 border-white bg-gray-200">
                                  <AvatarFallback className="text-xs">
                                    {attendee.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
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