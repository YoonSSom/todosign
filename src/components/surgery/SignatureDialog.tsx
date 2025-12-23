import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenLine, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import type { PatientInfo } from "@/pages/SurgeryConsent";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientInfo: PatientInfo;
  onComplete: () => void;
}

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
}

const SignaturePad = ({ onSignatureChange }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "hsl(var(--foreground))";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing && hasSignature) {
      const canvas = canvasRef.current;
      if (canvas) {
        onSignatureChange(canvas.toDataURL());
      }
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl border-2 border-dashed border-primary/30 bg-muted/30 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-40 cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm text-muted-foreground">여기에 서명해주세요</p>
          </div>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={clearSignature}
        className="w-full"
        disabled={!hasSignature}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        서명 지우기
      </Button>
    </div>
  );
};

const SignatureDialog = ({
  open,
  onOpenChange,
  patientInfo,
  onComplete,
}: SignatureDialogProps) => {
  const [phase, setPhase] = useState<"patient" | "guardian">("patient");
  const [patientSignature, setPatientSignature] = useState<string | null>(null);
  const [guardianSignature, setGuardianSignature] = useState<string | null>(null);

  const handlePatientSubmit = () => {
    if (!patientSignature) {
      toast.error("서명을 해주세요.");
      return;
    }

    if (patientInfo.isMinor) {
      setPhase("guardian");
    } else {
      toast.success("동의서 서명이 완료되었습니다.");
      onComplete();
    }
  };

  const handleGuardianSubmit = () => {
    if (!guardianSignature) {
      toast.error("보호자 서명을 해주세요.");
      return;
    }
    toast.success("동의서 서명이 완료되었습니다.");
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <PenLine className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            {phase === "patient" ? "환자 전자서명" : "보호자 전자서명"}
          </DialogTitle>
          <DialogDescription>
            {phase === "patient"
              ? `${patientInfo.name}님의 서명을 해주세요`
              : `보호자 ${patientInfo.guardianName}님의 서명을 해주세요`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {phase === "patient" ? (
            <SignaturePad onSignatureChange={setPatientSignature} />
          ) : (
            <SignaturePad onSignatureChange={setGuardianSignature} />
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            variant="hero"
            className="flex-1"
            onClick={phase === "patient" ? handlePatientSubmit : handleGuardianSubmit}
          >
            <Check className="w-4 h-4 mr-2" />
            {phase === "patient" && patientInfo.isMinor ? "다음" : "서명 완료"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
