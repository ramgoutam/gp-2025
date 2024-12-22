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
  category: "lab" | "followup" | "emergency" | "surgery" | "dentist";
}

export const EventCard = ({ title, startTime, endTime, attendees, category }: EventCardProps) => {
  const categoryColors = {
    lab: "bg-blue-50 border-blue-100",
    followup: "bg-purple-50 border-purple-100",
    emergency: "bg-red-50 border-red-100",
    surgery: "bg-green-50 border-green-100",
    dentist: "bg-amber-50 border-amber-100"
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