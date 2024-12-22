import { LabScript } from "@/components/patient/LabScriptsTab";

export const demoLabScripts: LabScript[] = [
  {
    id: "1",
    patientFirstName: "John",
    patientLastName: "Doe",
    doctorName: "Dr. Smith",
    clinicName: "Dental Care Center",
    requestDate: "2024-03-15",
    dueDate: "2024-03-30",
    status: "pending",
    upperTreatment: "Crown",
    lowerTreatment: "None",
    treatments: {
      upper: ["Crown"],
      lower: [],
    },
    applianceType: "Crown",
    specificInstructions: "Please ensure proper fit",
  },
  {
    id: "2",
    patientFirstName: "Jane",
    patientLastName: "Smith",
    doctorName: "Dr. Johnson",
    clinicName: "Smile Dental",
    requestDate: "2024-03-14",
    dueDate: "2024-03-28",
    status: "in_progress",
    upperTreatment: "Bridge",
    lowerTreatment: "None",
    treatments: {
      upper: ["Bridge"],
      lower: [],
    },
    applianceType: "Bridge",
    specificInstructions: "Patient has sensitivity",
  },
];