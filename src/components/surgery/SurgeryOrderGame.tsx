import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Check, X, RotateCcw, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SurgeryOrderGameProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

interface SurgeryType {
  id: string;
  name: string;
  description: string;
  isCorrect: boolean;
}

const surgeryTypes: SurgeryType[] = [
  { id: "open", name: "개복 수술", description: "배를 절개하여 수술하는 전통적 방법", isCorrect: true },
  { id: "laparoscopic", name: "복강경 수술", description: "작은 구멍을 통해 카메라로 수술", isCorrect: true },
  { id: "robotic", name: "로봇 수술", description: "로봇 팔을 이용한 정밀 수술", isCorrect: true },
  { id: "endoscopic", name: "내시경 수술", description: "자연 통로를 이용한 수술", isCorrect: false },
  { id: "minimal", name: "미세침습 수술", description: "최소 절개로 진행하는 수술", isCorrect: false },
  { id: "openSurgery", name: "개방 수술", description: "넓은 절개로 진행하는 수술", isCorrect: false },
];

const SurgeryOrderGame = ({
  open,
  onOpenChange,
  onComplete,
}: SurgeryOrderGameProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);

  const toggleSelection = (id: string) => {
    if (showResult) return;
    
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const checkAnswer = () => {
    const correctIds = surgeryTypes.filter((s) => s.isCorrect).map((s) => s.id);
    const isCorrect =
      selectedIds.length === correctIds.length &&
      selectedIds.every((id) => correctIds.includes(id));

    if (isCorrect) {
      setShowResult("correct");
      toast.success("정답입니다!");
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setShowResult("wrong");
      setWrongAttempts((prev) => prev + 1);
      toast.error("오답입니다. 다시 시도해주세요.");
      
      setTimeout(() => {
        setShowResult(null);
        setSelectedIds([]);
      }, 2000);
    }
  };

  const handleWatchAgain = () => {
    setWrongAttempts(0);
    setSelectedIds([]);
    setShowResult(null);
    // In real app, this would navigate back to video
    toast.info("영상을 다시 시청해주세요.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">수술 종류 이해도 확인</DialogTitle>
          <DialogDescription>
            자궁내막암 수술에 적합한 수술 종류를 모두 선택해주세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected items display */}
          <div className="min-h-[60px] p-3 rounded-xl bg-muted/50 border border-dashed border-border">
            <p className="text-xs text-muted-foreground mb-2">선택한 수술 종류:</p>
            <div className="flex flex-wrap gap-2">
              {selectedIds.length === 0 ? (
                <span className="text-sm text-muted-foreground">아래에서 선택해주세요</span>
              ) : (
                selectedIds.map((id) => {
                  const surgery = surgeryTypes.find((s) => s.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="text-sm">
                      {surgery?.name}
                    </Badge>
                  );
                })
              )}
            </div>
          </div>

          {/* Surgery type cards */}
          <div className="grid grid-cols-2 gap-3">
            {surgeryTypes.map((surgery) => {
              const isSelected = selectedIds.includes(surgery.id);
              return (
                <button
                  key={surgery.id}
                  onClick={() => toggleSelection(surgery.id)}
                  disabled={showResult !== null}
                  className={cn(
                    "p-3 rounded-xl border-2 text-left transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card",
                    showResult === "correct" && surgery.isCorrect && isSelected && "border-medical-success bg-medical-success/10",
                    showResult === "wrong" && !surgery.isCorrect && isSelected && "border-destructive bg-destructive/10"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{surgery.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{surgery.description}</p>
                    </div>
                    {isSelected && (
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        showResult === "correct" && surgery.isCorrect ? "bg-medical-success" : 
                        showResult === "wrong" && !surgery.isCorrect ? "bg-destructive" : "bg-primary"
                      )}>
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result display */}
          {showResult && (
            <div
              className={cn(
                "p-4 rounded-xl text-center animate-scale-in",
                showResult === "correct" ? "bg-medical-success/10 text-medical-success" : "bg-destructive/10 text-destructive"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {showResult === "correct" ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="font-medium">정답입니다!</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span className="font-medium">오답입니다 (시도 {wrongAttempts}/3)</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Wrong attempts warning */}
          {wrongAttempts >= 3 && (
            <div className="p-4 rounded-xl bg-medical-warning/10 border border-medical-warning/30">
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-medical-warning mt-0.5" />
                <div>
                  <p className="font-medium text-sm">영상을 다시 시청해주세요</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3회 이상 오답이므로 수술 설명 영상을 다시 시청해야 합니다
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {wrongAttempts >= 3 ? (
            <Button variant="hero" className="flex-1" onClick={handleWatchAgain}>
              <RotateCcw className="w-4 h-4 mr-2" />
              영상 다시 시청하기
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedIds([])}
                disabled={selectedIds.length === 0 || showResult !== null}
              >
                선택 초기화
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={checkAnswer}
                disabled={selectedIds.length === 0 || showResult !== null}
              >
                정답 확인
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurgeryOrderGame;
