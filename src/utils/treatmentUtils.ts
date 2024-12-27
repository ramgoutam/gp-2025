import { LabScript } from "@/types/labScript";

export const getTreatments = (script: LabScript) => {
  return {
    upper: script.upper_treatment && script.upper_treatment !== "None" ? [script.upper_treatment] : [],
    lower: script.lower_treatment && script.lower_treatment !== "None" ? [script.lower_treatment] : []
  };
};