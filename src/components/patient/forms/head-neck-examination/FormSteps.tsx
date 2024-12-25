import { ProgressBar } from "../../ProgressBar";

interface FormStepsProps {
  currentStep: number;
  totalSteps: number;
  stepsStatus: ("completed" | "current" | "upcoming")[];
}

export const FormSteps = ({ currentStep, stepsStatus }: FormStepsProps) => {
  const steps = [
    { label: "Patient Information & Vital Signs", status: stepsStatus[0] },
    { label: "Medical History", status: stepsStatus[1] },
    { label: "Chief Complaints", status: stepsStatus[2] },
    { label: "Extra-Oral Examination", status: stepsStatus[3] },
    { label: "Intra-Oral Examination", status: stepsStatus[4] },
    { label: "Dental Classification", status: stepsStatus[5] },
    { label: "Functional Presentation", status: stepsStatus[6] },
    { label: "Tactile & Radiographic", status: stepsStatus[7] },
    { label: "Evaluation", status: stepsStatus[8] },
    { label: "Guideline Questions", status: stepsStatus[9] }
  ].map(step => ({
    ...step,
    status: step.status as "completed" | "current" | "upcoming"
  }));

  return <ProgressBar steps={steps} />;
};