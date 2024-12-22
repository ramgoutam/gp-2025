export interface Attendee {
  name: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: Attendee[];
  category: "lab" | "followup" | "emergency" | "surgery" | "dentist";
}