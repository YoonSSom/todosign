import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Video, HelpCircle, Calendar, Clock, MessageSquare, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface AvatarVoiceChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  onComplete: () => void;
}

type Phase = "ready" | "video" | "understanding" | "consultation";

const AvatarVoiceChatDialog = ({
  open,
  onOpenChange,
  patientName,
  onComplete,
}: AvatarVoiceChatDialogProps) => {
  const [phase, setPhase] = useState<Phase>("ready");
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Consultation form state
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultDate, setConsultDate] = useState("");
  const [consultTime, setConsultTime] = useState("");
  const [consultReason, setConsultReason] = useState("");

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPhase("ready");
      setIsPlaying(false);
      setVideoEnded(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [open]);

  const handleStartVideo = () => {
    setPhase("video");
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
    setIsPlaying(false);
    setPhase("understanding");
  };

  const handleReplay = () => {
    setPhase("video");
    setVideoEnded(false);
    // Use setTimeout to ensure state update happens before playing
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 50);
  };

  const handleUnderstanding = (understood: boolean) => {
    if (understood) {
      onComplete();
    } else {
      setPhase("consultation");
    }
  };

  const handleConsultationSubmit = () => {
    if (!consultName.trim() || !consultPhone.trim()) {
      toast.error("이름과 연락처는 필수 입력 항목입니다.");
      return;
    }
    toast.success("의료진 면담이 신청되었습니다.");
    onComplete();
  };

  const formatPhoneDisplay = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-lg">
            {(phase === "ready" || phase === "video") && "AI 아바타 수술 설명"}
            {phase === "understanding" && "이해도 확인"}
            {phase === "consultation" && "의료진 면담 신청"}
          </DialogTitle>
          <DialogDescription>
            {phase === "understanding" && `${patientName}님, 설명을 이해하셨나요?`}
            {phase === "consultation" && "의료진과 직접 상담을 신청합니다"}
          </DialogDescription>
        </DialogHeader>

        {/* Video Element - Always rendered but visibility controlled */}
        {(phase === "ready" || phase === "video") && (
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src="/persona.mp4"
                className="w-full h-full object-contain"
                onEnded={handleVideoEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                playsInline
              />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              AI 설명을 끝까지 청취한 후에만 다음 단계로 이동 가능합니다.
            </p>

            {phase === "ready" && (
              <div className="flex justify-center">
                <Button variant="hero" size="default" onClick={handleStartVideo}>
                  <Play className="w-4 h-4 mr-2" />
                  대화 시작하기
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Understanding Phase */}
        {phase === "understanding" && (
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-medium">
                {patientName}님, 수술 설명을 이해하셨나요?
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                이해하지 못하셨다면 의료진 면담을 신청할 수 있습니다
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleReplay}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              설명 다시 듣기
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleUnderstanding(false)}
              >
                이해하지 못함
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={() => handleUnderstanding(true)}
              >
                이해함
              </Button>
            </div>
          </div>
        )}

        {/* Consultation Phase */}
        {phase === "consultation" && (
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consultName">이름 *</Label>
                  <Input
                    id="consultName"
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="이름 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultPhone">연락처 *</Label>
                  <Input
                    id="consultPhone"
                    type="tel"
                    value={formatPhoneDisplay(consultPhone)}
                    onChange={(e) => setConsultPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="연락처 입력"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consultDate" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    희망 일자
                  </Label>
                  <Input
                    id="consultDate"
                    type="date"
                    value={consultDate}
                    onChange={(e) => setConsultDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultTime" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    희망 시간
                  </Label>
                  <Input
                    id="consultTime"
                    type="time"
                    value={consultTime}
                    onChange={(e) => setConsultTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultReason" className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  상담 사유
                </Label>
                <Textarea
                  id="consultReason"
                  value={consultReason}
                  onChange={(e) => setConsultReason(e.target.value)}
                  placeholder="상담을 원하시는 이유를 입력해주세요"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPhase("understanding")}
              >
                뒤로
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={handleConsultationSubmit}
              >
                면담 신청 완료
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvatarVoiceChatDialog;
