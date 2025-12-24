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
import { Play, Pause, Video, HelpCircle, Calendar, Clock, MessageSquare, RotateCcw, Check, BookOpen, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import avatarDoctor from "@/assets/avatar-doctor.png";
import avatarNurse from "@/assets/avatar-nurse.png";

interface AvatarVoiceChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  onComplete: () => void;
}

type Phase = "intro" | "ready" | "video" | "understanding" | "understanding-check" | "understanding-explain" | "understanding-confirm" | "consultation";

// 수술 설명 주제 목록
const SURGERY_TOPICS = [
  { id: "procedure", label: "수술 방법 및 과정", explanation: "수술은 전신마취 하에 진행되며, 약 2-3시간 소요됩니다. 최소 침습 방식으로 진행되어 회복이 빠릅니다." },
  { id: "risks", label: "수술 위험성 및 합병증", explanation: "모든 수술에는 출혈, 감염, 마취 관련 위험이 있습니다. 드물게 신경 손상이나 혈전이 발생할 수 있으나, 발생률은 1% 미만입니다." },
  { id: "recovery", label: "회복 기간 및 주의사항", explanation: "수술 후 1-2일 입원이 필요하며, 완전한 회복까지 약 4-6주가 소요됩니다. 무거운 물건을 들거나 격렬한 운동은 피해주세요." },
  { id: "anesthesia", label: "마취 방법", explanation: "전신마취로 진행되며, 수술 전 마취과 전문의와 상담이 있습니다. 마취 전 8시간 금식이 필요합니다." },
  { id: "alternatives", label: "대체 치료법", explanation: "수술 외에 약물 치료, 물리 치료 등의 보존적 치료가 있으나, 현재 상태에서는 수술이 가장 효과적인 치료법입니다." },
];

const AvatarVoiceChatDialog = ({
  open,
  onOpenChange,
  patientName,
  onComplete,
}: AvatarVoiceChatDialogProps) => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<"doctor" | "nurse">("doctor");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Consultation form state
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultDate, setConsultDate] = useState("");
  const [consultTime, setConsultTime] = useState("");
  const [consultReason, setConsultReason] = useState("");
  
  // Understanding check state
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPhase("intro");
      setIsPlaying(false);
      setVideoEnded(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      setSelectedTopics([]);
    }
  }, [open]);

  const handleStartIntro = () => {
    setPhase("video");
    // Use setTimeout to ensure the fullscreen dialog renders first
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
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
      setPhase("understanding-check");
    }
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleProceedToExplanation = () => {
    if (selectedTopics.length === 0) {
      toast.error("이해하지 못한 항목을 선택해주세요.");
      return;
    }
    setPhase("understanding-explain");
  };

  const handleExplanationComplete = () => {
    setPhase("understanding-confirm");
  };

  const handleFinalUnderstanding = (understood: boolean) => {
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
    <>
      {/* Intro Popup */}
      <Dialog open={open && phase === "intro"} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg">AI 아바타 수술 설명</DialogTitle>
            <DialogDescription>
              대화할 AI 아바타를 선택해주세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="flex gap-6 justify-center">
              {/* Doctor Avatar */}
              <button
                onClick={() => setSelectedAvatar("doctor")}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  selectedAvatar === "doctor" 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
                  <img 
                    src={avatarDoctor} 
                    alt="AI 의사 아바타" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">남성</span>
                {selectedAvatar === "doctor" && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>

              {/* Nurse Avatar */}
              <button
                onClick={() => setSelectedAvatar("nurse")}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  selectedAvatar === "nurse" 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
                  <img 
                    src={avatarNurse} 
                    alt="AI 간호사 아바타" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">여성</span>
                {selectedAvatar === "nurse" && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              {patientName}님의 수술에 대해<br />선택하신 AI 아바타가 상세히 안내해 드리겠습니다.
            </p>
            
            <Button variant="hero" size="lg" onClick={handleStartIntro} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              대화 시작하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Video Dialog */}
      <Dialog open={open && phase !== "intro"} onOpenChange={onOpenChange}>
        <DialogContent className="w-screen h-screen max-w-none m-0 rounded-none flex flex-col">
          {phase !== "understanding" && phase !== "understanding-check" && phase !== "understanding-explain" && phase !== "understanding-confirm" && (
            <DialogHeader className="text-center shrink-0 pt-4">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-lg">
                {(phase === "ready" || phase === "video") && "AI 아바타 수술 설명"}
                {phase === "consultation" && "의료진 면담 신청"}
              </DialogTitle>
              <DialogDescription>
                {phase === "consultation" && "의료진과 직접 상담을 신청합니다"}
              </DialogDescription>
            </DialogHeader>
          )}

          {/* Video Element - Always rendered but visibility controlled */}
          {(phase === "ready" || phase === "video") && (
            <div className="flex flex-col gap-4 flex-1 overflow-hidden">
              <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={selectedAvatar === "nurse" ? "/persona_W.mp4" : "/persona.mp4"}
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

            </div>
          )}

        {/* Understanding Phase */}
        {phase === "understanding" && (
          <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-lg mx-auto w-full">
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center mb-8">
              <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">
                {patientName}님, 수술 설명을 이해하셨나요?
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                이해하지 못하셨다면 의료진 면담을 신청할 수 있습니다
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base py-6"
                onClick={handleReplay}
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                설명 다시 듣기
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 text-base py-6"
                  onClick={() => handleUnderstanding(false)}
                >
                  이해하지 못함
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1 text-base py-6"
                  onClick={() => handleUnderstanding(true)}
                >
                  이해함
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Understanding Check Phase - Select topics not understood */}
        {phase === "understanding-check" && (
          <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-lg mx-auto w-full overflow-auto">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center mb-6">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">
                어떤 부분이 이해되지 않으셨나요?
              </h2>
              <p className="text-sm text-muted-foreground">
                이해하지 못한 항목을 모두 선택해주세요
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {SURGERY_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTopics.includes(topic.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleTopicToggle(topic.id)}
                >
                  <Checkbox
                    checked={selectedTopics.includes(topic.id)}
                    onCheckedChange={() => handleTopicToggle(topic.id)}
                  />
                  <span className="text-base font-medium">{topic.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setPhase("understanding")}
              >
                뒤로
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={handleProceedToExplanation}
              >
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Understanding Explain Phase - Show explanations */}
        {phase === "understanding-explain" && (
          <div className="flex-1 flex flex-col px-6 py-8 max-w-lg mx-auto w-full overflow-auto">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center mb-6">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">
                추가 설명
              </h2>
              <p className="text-sm text-muted-foreground">
                선택하신 항목에 대한 상세 설명입니다
              </p>
            </div>

            <div className="space-y-4 mb-6 flex-1 overflow-auto">
              {SURGERY_TOPICS.filter(topic => selectedTopics.includes(topic.id)).map((topic) => (
                <div
                  key={topic.id}
                  className="p-5 rounded-xl border border-border bg-card"
                >
                  <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {topic.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {topic.explanation}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleExplanationComplete}
            >
              설명을 모두 확인했습니다
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Understanding Confirm Phase - Ask again */}
        {phase === "understanding-confirm" && (
          <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-lg mx-auto w-full">
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center mb-8">
              <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">
                {patientName}님, 이제 이해가 되셨나요?
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                추가 설명을 확인하셨습니다.<br />
                여전히 이해가 어려우시면 의료진 면담을 신청하실 수 있습니다.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base py-6"
                onClick={handleReplay}
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                처음부터 다시 듣기
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 text-base py-6"
                  onClick={() => handleFinalUnderstanding(false)}
                >
                  의료진 면담 신청
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1 text-base py-6"
                  onClick={() => handleFinalUnderstanding(true)}
                >
                  이해함
                </Button>
              </div>
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
    </>
  );
};

export default AvatarVoiceChatDialog;
