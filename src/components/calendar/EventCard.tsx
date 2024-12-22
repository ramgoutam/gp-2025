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
    lab: "bg-blue-50/80 border-blue-200 hover:bg-blue-100/80",
    followup: "bg-purple-50/80 border-purple-200 hover:bg-purple-100/80",
    emergency: "bg-pink-50/80 border-pink-200 hover:bg-pink-100/80",
    surgery: "bg-orange-50/80 border-orange-200 hover:bg-orange-100/80",
    dentist: "bg-cyan-50/80 border-cyan-200 hover:bg-cyan-100/80"
  };

  return (
    <div
      className={`p-2 rounded-lg border shadow-sm ${categoryColors[category]} transition-all cursor-pointer`}
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
            <Avatar key={index} className="h-6 w-6 border-2 border-white">
              <AvatarFallback className="text-xs bg-gray-200">
                {attendee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
};