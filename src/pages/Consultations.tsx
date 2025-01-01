import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Consultation {
  id: string;
  lead_id: string;
  consultation_date: string;
  status: string;
  lead: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
  };
}

const Consultations = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const { data: consultations, isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      console.log("Fetching consultations...");
      const { data, error } = await supabase
        .from("consultations")
        .select(`
          *,
          lead:leads (
            first_name,
            last_name,
            email,
            phone,
            company
          )
        `)
        .order("consultation_date", { ascending: true });

      if (error) {
        console.error("Error fetching consultations:", error);
        throw error;
      }

      console.log("Fetched consultations:", data);
      return data as Consultation[];
    },
  });

  const consultationsForSelectedDate = consultations?.filter(consultation => {
    const consultationDate = new Date(consultation.consultation_date);
    return (
      consultationDate.getDate() === selectedDate.getDate() &&
      consultationDate.getMonth() === selectedDate.getMonth() &&
      consultationDate.getFullYear() === selectedDate.getFullYear()
    );
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Consultations Calendar</h1>
        <p className="text-gray-500 mt-1">View and manage scheduled consultations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevMonth = new Date(selectedDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setSelectedDate(prevMonth);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextMonth = new Date(selectedDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
              >
                Next Month
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Consultations for {format(selectedDate, "MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consultationsForSelectedDate?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No consultations scheduled for this date
                </p>
              ) : (
                consultationsForSelectedDate?.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {consultation.lead.first_name} {consultation.lead.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {consultation.lead.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {consultation.lead.phone || "No phone number"}
                        </p>
                        {consultation.lead.company && (
                          <p className="text-sm text-gray-600">
                            {consultation.lead.company}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(new Date(consultation.consultation_date), "h:mm a")}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {consultation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Consultations;