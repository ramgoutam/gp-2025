import { Check } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgressBarProps {
  steps: Step[];
  onStepClick?: (index: number) => void;
}

export const ProgressBar = ({ steps, onStepClick }: ProgressBarProps) => {
  console.log("Progress bar steps:", steps);

  const handleStepClick = (index: number, status: Step["status"]) => {
    // Only allow clicking on completed steps or the next available step
    if (status === "completed" || status === "current") {
      console.log("Navigating to step:", index);
      onStepClick?.(index);
    }
  };

  return (
    <div className="flex items-start w-full">
      {steps.map((step, index) => (
        <div 
          key={step.label} 
          className="flex-1 relative"
          onClick={() => handleStepClick(index, step.status)}
          role="button"
          tabIndex={0}
          style={{ cursor: step.status === "upcoming" ? "not-allowed" : "pointer" }}
        >
          <div className="flex items-center justify-center">
            {index > 0 && (
              <div
                className={`h-[2px] w-full absolute top-4 -left-[calc(50%-16px)] ${
                  step.status === "completed" || steps[index - 1].status === "completed"
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 relative z-10 ${
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
          </div>
          <div className="mt-2 text-center">
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
        </div>
      ))}
    </div>
  );
};