import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  status: string | null;
  created_at: string;
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
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !lead) return;
    
    const consultationDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    consultationDate.setHours(hours, minutes);
    
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([
          {
            lead_id: lead.id,
            consultation_date: consultationDate.toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Consultation Scheduled",
        description: `Consultation scheduled for ${lead.first_name} ${
          lead.last_name
        } on ${format(consultationDate, "PPP")} at ${selectedTime}`,
      });

      onClose();
      setSelectedDate(undefined);
      setSelectedTime("");
      
      // Navigate to the consultations page
      navigate('/consultations');
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast({
        title: "Error",
        description: "Failed to schedule consultation. Please try again.",
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
        {lead && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <p className="text-sm text-gray-500">
                {lead.first_name} {lead.last_name}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label>Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};