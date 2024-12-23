import { Check } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgressBarProps {
  steps: Step[];
}

export const ProgressBar = ({ steps }: ProgressBarProps) => {
  console.log("Progress bar steps:", steps); // Added for debugging

  return (
    <div className="flex items-center w-full gap-2">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center flex-1">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 ${
                step.status === "completed"
                  ? "bg-primary border-primary"
                  : step.status === "current"
                  ? "border-2 border-primary bg-white"
                  : "border-2 border-gray-200 bg-white"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <span
                  className={`text-sm font-medium ${
                    step.status === "current" ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {index + 1}
                </span>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                step.status === "completed"
                  ? "text-primary"
                  : step.status === "current"
                  ? "text-primary"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-[2px] w-12 mx-2 ${
                step.status === "completed" ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};