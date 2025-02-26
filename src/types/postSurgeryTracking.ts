
export type PostSurgeryItem = {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  surgeryDate: string;
  status: "pending" | "completed" | "cancelled";
  notes: string;
  treatments?: string[];
};

export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
};

export const treatmentOptions = [
  "Wisdom Teeth Extraction",
  "Denture (Lower)",
  "Denture (Upper)",
  "Implant Supported Denture (Lower)",
  "Implant Supported Denture (Upper)",
  "Fixed Implant Zirconia Bridge (Lower)",
  "Fixed Implant Zirconia Bridge (Upper)",
  "Single Implant",
  "Multiple Implants",
  "Extraction(s)",
  "Fixed Implant Nano-ceramic Bridge (Upper)",
  "Fixed Implant Nano-ceramic Bridge (Lower)",
  "Fixed Implant Nano-ceramic Bridge (Dual Arch)",
  "Fixed Implant Zirconia Bridge (Dual Arch)",
  "Implant Supported Denture (Dual Arch)",
  "Surgical Revision",
  "Extractions and Implant Placement",
  "LATERAL WINDOW SINUS LIFT"
] as const;

export const formSteps = [
  { title: "Patient & Treatment Selection", fields: ["patient", "treatments"] },
  { title: "Item Details", fields: ["itemName", "category", "quantity"] },
  { title: "Surgery Information", fields: ["surgeryDate", "notes"] }
] as const;
