import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface DateSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onNavigateDay: (days: number) => void;
}

export const DateSelector = ({ currentDate, onDateChange, onNavigateDay }: DateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const navigateToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onNavigateDay(-1)}
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
        onClick={() => onNavigateDay(1)}
      >
        Tomorrow
      </Button>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline"
            className="ml-2 text-left font-normal"
          >
            <span>{format(currentDate, 'PPP')}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white border shadow-md z-50" 
          align="start"
        >
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
                setOpen(false);
              }
            }}
            initialFocus
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};