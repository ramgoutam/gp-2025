export interface Attendee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: "lab" | "followup" | "emergency" | "surgery" | "dentist" | "consultation";
  attendees: Attendee[];
}