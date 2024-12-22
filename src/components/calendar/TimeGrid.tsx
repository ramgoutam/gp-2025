interface TimeGridProps {
  timeSlots: number[];
}

export const TimeGrid = ({ timeSlots }: TimeGridProps) => {
  return (
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
  );
};