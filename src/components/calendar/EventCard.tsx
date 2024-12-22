import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Attendee {
  name: string;
  avatar?: string;
}

interface EventCardProps {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: Attendee[];
  category: "lab" | "followup" | "emergency" | "surgery" | "dentist";
  onDragStart?: (id: string, e: React.MouseEvent) => void;
}

export const EventCard = ({ 
  id,
  title, 
  startTime, 
  endTime, 
  attendees, 
  category,
  onDragStart 
}: EventCardProps) => {
  const categoryStyles = {
    lab: "bg-blue-50 border-blue-200 hover:bg-blue-100/90 text-blue-800",
    followup: "bg-purple-50 border-purple-200 hover:bg-purple-100/90 text-purple-800",
    emergency: "bg-pink-50 border-pink-200 hover:bg-pink-100/90 text-pink-800",
    surgery: "bg-orange-50 border-orange-200 hover:bg-orange-100/90 text-orange-800",
    dentist: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100/90 text-cyan-800"
  };

  return (
    <div
      className={`absolute inset-0 p-2 rounded-lg border shadow-sm ${categoryStyles[category]} transition-all cursor-move hover:shadow-md`}
      onMouseDown={(e) => onDragStart?.(id, e)}
    >
      <div className="flex flex-col h-full">
        <h3 className="text-sm font-medium truncate">
          {title}
        </h3>
        <p className="text-xs opacity-75">
          {startTime} - {endTime}
        </p>
        {attendees.length > 0 && (
          <div className="flex -space-x-2 mt-1">
            {attendees.map((attendee, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-white">
                <AvatarFallback className="text-xs">
                  {attendee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};