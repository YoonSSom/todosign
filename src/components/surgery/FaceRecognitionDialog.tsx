import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Shield, CheckCircle2 } from "lucide-react";

interface FaceRecognitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onBack: () => void;
}

const FaceRecognitionDialog = ({
  open,
  onOpenChange,
  onComplete,
  onBack,
}: FaceRecognitionDialogProps) => {
  const handleStart = () => {
    // In a real app, this would request camera permissions and perform face recognition
    // For now, we simulate success
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">실시간 얼굴 인식</DialogTitle>
          <DialogDescription>
            환자 본인 확인을 위해 카메라 접근 권한이 필요합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-xl bg-muted/50 space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">얼굴 인식 목적</p>
                <p className="text-sm text-muted-foreground mt-1">
                  환자 본인이 직접 수술 동의서를 확인하고 있는지 검증합니다
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-medical-success mt-0.5" />
              <div>
                <p className="font-medium text-sm">안전한 처리</p>
                <p className="text-sm text-muted-foreground mt-1">
                  얼굴 인식은 백그라운드에서만 실행되며, 화면에 표시되지 않습니다
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            이전
          </Button>
          <Button variant="hero" className="flex-1" onClick={handleStart}>
            다음
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaceRecognitionDialog;
