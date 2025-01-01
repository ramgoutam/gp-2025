import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DateSelector } from "@/components/calendar/DateSelector";
import { CalendarColumn } from "@/components/calendar/CalendarColumn";
import { useEventDrag } from "@/hooks/useEventDrag";
import { Event } from "@/types/calendar";

const timeSlots = Array.from({ length: 24 }, (_, i) => i + 1);

const categories = [
  { id: "consultation", label: "Consultations" }
];

const Consultations = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ["consultations", format(currentDate, "yyyy-MM-dd")],
    queryFn: async () => {
      console.log("Fetching consultations for date:", format(currentDate, "yyyy-MM-dd"));
      const { data, error } = await supabase
        .from("consultations")
        .select(`
          id,
          consultation_date,
          leads (
            first_name,
            last_name
          )
        `)
        .gte('consultation_date', format(currentDate, "yyyy-MM-dd"))
        .lt('consultation_date', format(new Date(currentDate.getTime() + 86400000), "yyyy-MM-dd"));

      if (error) {
        console.error("Error fetching consultations:", error);
        throw error;
      }

      console.log("Fetched consultations:", data);

      return data.map((consultation: any) => ({
        id: consultation.id,
        title: `${consultation.leads.first_name} ${consultation.leads.last_name}`,
        startTime: format(new Date(consultation.consultation_date), "HH:mm"),
        endTime: format(new Date(new Date(consultation.consultation_date).getTime() + 1800000), "HH:mm"),
        category: "consultation",
        attendees: []
      }));
    }
  });

  const {
    dragState,
    isDragging,
    dragStart,
    previewEvent,
    handleDragStart,
    handleNewEventDragStart,
    handleNewEventDragMove,
    handleNewEventDragEnd,
    calculatePosition,
    calculateHeight,
  } = useEventDrag();

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const navigateDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
        <p className="text-gray-500 mt-1">View and manage your scheduled consultations</p>
      </div>

      <DateSelector
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onNavigateDay={navigateDay}
      />

      <div className="grid grid-cols-1 gap-4 mt-4">
        {categories.map(({ id, label }) => (
          <CalendarColumn
            key={id}
            category={id as any}
            categoryLabel={label}
            timeSlots={timeSlots}
            events={consultations}
            onDragStart={handleDragStart}
            onNewEventDragStart={handleNewEventDragStart}
            onNewEventDragMove={handleNewEventDragMove}
            onNewEventDragEnd={handleNewEventDragEnd}
            dragState={dragState}
            isDragging={isDragging}
            dragStart={dragStart}
            previewEvent={previewEvent}
            calculatePosition={calculatePosition}
            calculateHeight={calculateHeight}
          />
        ))}
      </div>
    </div>
  );
};

export default Consultations;