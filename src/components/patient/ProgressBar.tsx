import React from "react";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgressBarProps {
  steps: readonly Step[];
}

export const ProgressBar = ({ steps }: ProgressBarProps) => {
  return (
    <div className="flex items-center h-full">
      <div className="flex flex-col justify-between h-full relative">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-primary text-white' : 
                    isCurrent ? 'border-2 border-primary bg-white' : 
                    'border-2 border-gray-200 bg-white'}
                `}
              >
                {index + 1}
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className="absolute w-[2px] bg-gray-200 h-8"
                  style={{
                    left: '5.75rem',
                    top: `${(index * 3.5) + 1.5}rem`,
                  }}
                >
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: '100%',
                      transform: `scaleY(${isCompleted ? 1 : 0})`,
                      transformOrigin: 'top',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};