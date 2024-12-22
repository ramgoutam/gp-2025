import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: { name: string; avatar?: string }[];
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
      ]
    },
    {
      id: "2",
      title: "Prepare final design deliverables",
      startTime: "9:40",
      endTime: "11:30",
      attendees: [
        { name: "Alice Johnson" },
        { name: "Bob Wilson" },
        { name: "Carol Brown" }
      ]
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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {formatDate(currentDate)}
                </span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              Event
            </Button>
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

            {/* Events container */}
            <div className="ml-14">
              {/* Time grid lines */}
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="border-t border-gray-100 h-16"
                />
              ))}

              {/* Events */}
              {events.map((event) => (
                <div
                  key={event.id}
                  className="absolute left-16 right-4 p-2 rounded bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
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
                    <h3 className="text-sm font-medium text-gray-900 truncate">{event.title}</h3>
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
        </Card>
      </main>
    </div>
  );
}