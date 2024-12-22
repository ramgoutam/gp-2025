import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Attendee {
  name: string;
  avatar?: string;
}

interface EventCardProps {
  title: string;
  startTime: string;
  endTime: string;
  attendees: Attendee[];
  category: "personal" | "work" | "health" | "other";
}

export const EventCard = ({ title, startTime, endTime, attendees, category }: EventCardProps) => {
  const categoryColors = {
    personal: "bg-blue-50 border-blue-100",
    work: "bg-purple-50 border-purple-100",
    health: "bg-green-50 border-green-100",
    other: "bg-gray-50 border-gray-100"
  };

  return (
    <div
      className={`p-2 rounded ${categoryColors[category]} hover:brightness-95 transition-all cursor-pointer`}
    >
      <div className="flex flex-col h-full">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {title}
        </h3>
        <p className="text-xs text-gray-600">
          {startTime} - {endTime}
        </p>
        <div className="flex -space-x-2 mt-1">
          {attendees.map((attendee, index) => (
            <Avatar key={index} className="h-6 w-6 border-2 border-white bg-gray-200">
              <AvatarFallback className="text-xs">
                {attendee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
};