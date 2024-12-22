interface TimeGridProps {
  timeSlots: number[];
}

export const TimeGrid = ({ timeSlots }: TimeGridProps) => {
  return (
    <div className="absolute top-0 left-0 w-14 h-full border-r border-gray-100">
      {timeSlots.map((hour) => (
        <div 
          key={hour} 
          className="flex items-center justify-end pr-2 h-16 text-xs text-gray-500"
          style={{ transform: 'translateY(-0.75rem)' }}
        >
          {`${hour}:00`}
        </div>
      ))}
    </div>
  );
};