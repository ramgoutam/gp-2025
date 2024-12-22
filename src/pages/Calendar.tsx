import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: { name: string; avatar?: string }[];
  backgroundColor: string;
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
      backgroundColor: "bg-blue-100"
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
      ],
      backgroundColor: "bg-orange-200"
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto py-6">
        <Card className="bg-white">
          {/* Calendar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Calendar</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {formatDate(currentDate)}
                </span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Event
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            <div className="relative min-h-[800px]">
              {/* Time slots */}
              <div className="absolute top-0 left-0 w-16 h-full">
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-20 -mt-3 text-sm text-gray-500">
                    {`${hour}:00`}
                  </div>
                ))}
              </div>

              {/* Events container */}
              <div className="ml-16 relative">
                {/* Time grid lines */}
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="border-t border-gray-200 h-20"
                  />
                ))}

                {/* Events */}
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`absolute left-4 right-4 p-3 rounded-lg ${event.backgroundColor}`}
                    style={{
                      top: `${(parseInt(event.startTime.split(':')[0]) - 6) * 80 + 
                        (parseInt(event.startTime.split(':')[1]) / 60) * 80}px`,
                      height: `${((parseInt(event.endTime.split(':')[0]) * 60 + 
                        parseInt(event.endTime.split(':')[1])) - 
                        (parseInt(event.startTime.split(':')[0]) * 60 + 
                        parseInt(event.startTime.split(':')[1]))) / 60 * 80}px`
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-sm">{event.title}</h3>
                      <p className="text-xs text-gray-600">
                        {event.startTime} - {event.endTime}
                      </p>
                      <div className="flex -space-x-2 mt-2">
                        {event.attendees.map((attendee, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback>
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
          </div>
        </Card>
      </main>
    </div>
  );
}