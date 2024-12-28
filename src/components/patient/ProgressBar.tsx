import { Check } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgressBarProps {
  steps: Step[];
  onStepClick?: (index: number) => void;
  activeStep?: number;
}

export const ProgressBar = ({ steps, onStepClick, activeStep }: ProgressBarProps) => {
  console.log("Progress bar steps:", steps, "Active step:", activeStep);

  const handleStepClick = (index: number, status: Step["status"]) => {
    if (status === "completed" || status === "current") {
      console.log("Navigating to step:", index);
      onStepClick?.(index);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {steps.map((step, index) => (
        <div 
          key={step.label} 
          className="flex items-center space-x-2"
          onClick={() => handleStepClick(index, step.status)}
          role="button"
          tabIndex={0}
          style={{ cursor: step.status === "upcoming" ? "not-allowed" : "pointer" }}
        >
          <div className="relative">
            {index > 0 && (
              <div
                className={`w-[2px] h-4 absolute -top-4 left-1/2 -translate-x-1/2 ${
                  step.status === "completed"
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}
              />
            )}
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300 ${
                step.status === "completed"
                  ? "bg-primary border-primary text-white"
                  : step.status === "current"
                  ? "bg-white border-2 border-primary text-primary"
                  : "border-2 border-gray-200 bg-white"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="h-3 w-3 text-white" />
              ) : (
                <span
                  className={`text-xs font-medium ${
                    step.status === "current"
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                >
                  {index + 1}
                </span>
              )}
            </div>
          </div>
          <span
            className={`text-xs font-medium ${
              step.status === "completed" || step.status === "current"
                ? "text-gray-900"
                : "text-gray-400"
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};