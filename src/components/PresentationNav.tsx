import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createContext, useContext, useState, ReactNode } from "react";

// Define all presentation steps
export const presentationSteps = [
  { id: "home", label: "홈", path: "/" },
  { id: "identity", label: "본인 확인", path: "/surgery-consent" },
  { id: "surgery-info", label: "수술 정보", path: "/surgery-consent" },
  { id: "face-recognition", label: "얼굴 인식", path: "/surgery-consent" },
  { id: "avatar-explanation", label: "AI 설명", path: "/surgery-consent" },
  { id: "game", label: "순서 게임", path: "/surgery-consent" },
  { id: "consent-form", label: "동의서 작성", path: "/surgery-consent" },
  { id: "complete", label: "완료", path: "/surgery-consent" },
];

type StepId = typeof presentationSteps[number]["id"];

interface PresentationContextType {
  currentStepId: StepId;
  setCurrentStepId: (id: StepId) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

const PresentationContext = createContext<PresentationContextType | null>(null);

export function usePresentationNav() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error("usePresentationNav must be used within PresentationNavProvider");
  }
  return context;
}

export function PresentationNavProvider({ children }: { children: ReactNode }) {
  const [currentStepId, setCurrentStepId] = useState<StepId>("home");
  const navigate = useNavigate();
  const location = useLocation();

  const goToNextStep = () => {
    const currentIndex = presentationSteps.findIndex((s) => s.id === currentStepId);
    if (currentIndex < presentationSteps.length - 1) {
      const nextStep = presentationSteps[currentIndex + 1];
      setCurrentStepId(nextStep.id);
      if (nextStep.path !== location.pathname) {
        navigate(nextStep.path);
      }
    }
  };

  const goToPrevStep = () => {
    const currentIndex = presentationSteps.findIndex((s) => s.id === currentStepId);
    if (currentIndex > 0) {
      const prevStep = presentationSteps[currentIndex - 1];
      setCurrentStepId(prevStep.id);
      if (prevStep.path !== location.pathname) {
        navigate(prevStep.path);
      }
    }
  };

  return (
    <PresentationContext.Provider value={{ currentStepId, setCurrentStepId, goToNextStep, goToPrevStep }}>
      {children}
    </PresentationContext.Provider>
  );
}

interface PresentationNavProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export function PresentationNav({ onNext, onPrev }: PresentationNavProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  
  let contextValue: PresentationContextType | null = null;
  try {
    contextValue = usePresentationNav();
  } catch {
    // Context not available, use simple page navigation
  }

  const currentStepId = contextValue?.currentStepId;
  const currentIndex = currentStepId 
    ? presentationSteps.findIndex((s) => s.id === currentStepId)
    : presentationSteps.findIndex((s) => s.path === location.pathname);
  
  const prevStep = currentIndex > 0 ? presentationSteps[currentIndex - 1] : null;
  const nextStep = currentIndex < presentationSteps.length - 1 ? presentationSteps[currentIndex + 1] : null;

  // Don't show on NotFound page
  if (currentIndex === -1) return null;

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else if (contextValue) {
      contextValue.goToPrevStep();
    } else if (prevStep) {
      navigate(prevStep.path);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (contextValue) {
      contextValue.goToNextStep();
    } else if (nextStep) {
      navigate(nextStep.path);
    }
  };

  const handleStepClick = (step: typeof presentationSteps[number], index: number) => {
    if (contextValue) {
      contextValue.setCurrentStepId(step.id);
      if (step.path !== location.pathname) {
        navigate(step.path);
      }
    } else {
      navigate(step.path);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-background/60 backdrop-blur-md border border-border/50 rounded-full px-3 py-2 shadow-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrev}
        disabled={!prevStep && !onPrev}
        className="rounded-full px-3 gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">이전</span>
      </Button>

      <div className="flex items-center gap-1.5 px-2">
        {presentationSteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(step, index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-4"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            title={step.label}
          />
        ))}
      </div>

      <span className="text-xs text-muted-foreground min-w-[60px] text-center hidden sm:block">
        {presentationSteps[currentIndex]?.label}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleNext}
        disabled={!nextStep && !onNext}
        className="rounded-full px-3 gap-1"
      >
        <span className="hidden sm:inline">다음</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
