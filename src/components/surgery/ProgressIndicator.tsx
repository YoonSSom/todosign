import { Check, User, FileText, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: "identity" | "consent-form";
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  const steps = [
    { id: "identity", label: "본인확인", icon: User, emoji: "🎯" },
    { id: "consent-form", label: "동의서 작성", icon: FileText, emoji: "📝" },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="max-w-lg mx-auto mb-4">
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 transform",
                    isCompleted && "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30 scale-95",
                    isCurrent && "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/40 scale-105 animate-pulse",
                    !isCompleted && !isCurrent && "bg-slate-700/50 border-2 border-dashed border-slate-600"
                  )}
                >
                  {isCompleted ? (
                    <div className="relative">
                      <Check className="w-8 h-8 text-white" />
                      <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                  ) : isCurrent ? (
                    <div className="relative">
                      <span className="text-2xl">{step.emoji}</span>
                      <Zap className="absolute -top-2 -right-2 w-5 h-5 text-yellow-300 animate-bounce" />
                    </div>
                  ) : (
                    <span className="text-2xl opacity-50">{step.emoji}</span>
                  )}
                  
                  {/* Glow effect for current */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 blur-xl opacity-50 -z-10" />
                  )}
                </div>
                
                <span
                  className={cn(
                    "text-sm mt-3 font-bold tracking-wide",
                    isCompleted && "text-green-400",
                    isCurrent && "text-white",
                    !isCompleted && !isCurrent && "text-slate-500"
                  )}
                >
                  {step.label}
                </span>
                
                {/* Stage number badge */}
                <span
                  className={cn(
                    "text-xs mt-1 px-2 py-0.5 rounded-full font-medium",
                    isCompleted && "bg-green-500/20 text-green-300",
                    isCurrent && "bg-purple-500/20 text-purple-300",
                    !isCompleted && !isCurrent && "bg-slate-700 text-slate-500"
                  )}
                >
                  STAGE {index + 1}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex items-center mx-4">
                  <div
                    className={cn(
                      "w-16 sm:w-24 h-2 rounded-full transition-all duration-500 relative overflow-hidden",
                      index < currentIndex ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-slate-700"
                    )}
                  >
                    {index < currentIndex && (
                      <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
