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
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                step.status === "completed"
                  ? "bg-green-500 border-green-500"
                  : step.status === "current"
                  ? "border-primary bg-white"
                  : "border-gray-300 bg-white"
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
              className={`mt-2 text-sm font-medium ${
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
              className={`h-[2px] w-16 mx-2 ${
                step.status === "completed" ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};