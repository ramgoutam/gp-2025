export const demoLabScripts = [
  {
    id: "1",
    doctorName: "Dr. Sarah Smith",
    clinicName: "Dental Excellence Center",
    requestDate: "2024-03-15",
    dueDate: "2024-03-30",
    status: "pending" as const,
    applianceType: "Surgical Day appliance",
    treatments: {
      upper: ["Full Arch Fixed"],
      lower: ["None"]
    },
    specificInstructions: "Patient has metal sensitivity, please use ceramic materials only."
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    clinicName: "Advanced Dental Care",
    requestDate: "2024-03-10",
    dueDate: "2024-03-25",
    status: "in_progress" as const,
    applianceType: "Printed Try-in",
    treatments: {
      upper: ["Crown"],
      lower: ["Denture"]
    },
    specificInstructions: "Rush order - patient traveling internationally next month."
  },
  {
    id: "3",
    doctorName: "Dr. Sarah Smith",
    clinicName: "Dental Excellence Center",
    requestDate: "2024-03-01",
    dueDate: "2024-03-20",
    status: "completed" as const,
    applianceType: "Nightguard",
    treatments: {
      upper: ["Nightguard"],
      lower: ["None"]
    },
    specificInstructions: "Patient grinds teeth heavily - reinforce material thickness."
  }
];