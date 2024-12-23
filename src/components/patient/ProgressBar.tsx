import { Check } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgressBarProps {
  steps: Step[];
}

export const ProgressBar = ({ steps }: ProgressBarProps) => {
  return (
    <div className="flex items-center w-full mb-6 px-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center flex-1">
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                step.status === "completed"
                  ? "bg-green-500 border-green-500"
                  : step.status === "current"
                  ? "border-primary bg-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="h-3 w-3 text-white" />
              ) : (
                <span
                  className={`text-xs font-medium ${
                    step.status === "current" ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {index + 1}
                </span>
              )}
            </div>
            <span
              className={`ml-2 text-xs font-medium ${
                step.status === "completed"
                  ? "text-green-500"
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
              className={`h-[1px] w-full mx-2 ${
                step.status === "completed" ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};