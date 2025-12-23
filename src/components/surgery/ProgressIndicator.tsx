import { Check, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: "identity" | "consent-form";
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  const steps = [
    { id: "identity", label: "본인확인", icon: User },
    { id: "consent-form", label: "동의서 작성", icon: FileText },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 font-medium",
                    (isCompleted || isCurrent) && "text-primary",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-20 sm:w-32 h-1 mx-2 rounded-full transition-all duration-300",
                    index < currentIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
