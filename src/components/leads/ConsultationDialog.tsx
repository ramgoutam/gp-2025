import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
}

interface ConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

export const ConsultationDialog = ({
  isOpen,
  onClose,
  lead,
}: ConsultationDialogProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("09:00");
  const { toast } = useToast();

  const handleSchedule = async () => {
    if (!date || !lead) return;

    const consultationDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(time.split(":")[0]),
      parseInt(time.split(":")[1])
    );

    try {
      const { error } = await supabase.from("consultations").insert({
        lead_id: lead.id,
        consultation_date: consultationDate.toISOString(),
        status: "scheduled",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consultation scheduled successfully",
      });

      onClose();
    } catch (error) {
      console.error("Error scheduling consultation:", error);
      toast({
        title: "Error",
        description: "Failed to schedule consultation",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Consultation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div className="grid gap-2">
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSchedule}>Schedule Consultation</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};