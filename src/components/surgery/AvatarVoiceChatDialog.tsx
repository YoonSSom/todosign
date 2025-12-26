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
import { Play, Pause, Video, HelpCircle, Calendar, Clock, MessageSquare, RotateCcw, Check, BookOpen, ChevronRight, ChevronLeft, Mic, MicOff, Volume2, UserRound, Headphones } from "lucide-react";
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

type Phase = "intro" | "ready" | "video" | "understanding" | "understanding-check" | "understanding-explain" | "understanding-confirm" | "consultation-confirm" | "ai-voice-chat" | "consultation";

// 수술동의서 PDF 기반 AI 상담 지식 베이스
const SURGERY_KNOWLEDGE_BASE = {
  surgeryPurpose: `자궁내막암의 표준 치료는 자궁절제술(양측 난소/난관 절제술 포함 가능)을 포함한 병기설정 수술입니다. 수술 후 조직병리학적 예후인자를 확인하여 생존율 향상과 재발률 감소를 위해 항암화학요법 및 방사선 치료 등의 시행 여부를 결정하게 됩니다.`,
  
  riskFactors: `환자의 나이가 70세 이상, 수술 시간이 길어진 경우, 수술 범위가 큰 경우, 환자의 전신 활동이 제한적인 경우, 영양 상태가 불량한 경우, 만성질환(고혈압, 당뇨, 면역질환 등)이 있는 경우는 수술 이후에 회복이 늦어질 수 있으며, 장기간 중환자실 치료가 필요할 수 있습니다.`,
  
  alternativeTreatment: `가임력 보존을 원할 시, 초기 자궁내막암이면서 특정 조직병리학적 조건을 모두 갖춘 경우, 제한적으로 호르몬(프로게스테론) 치료를 시도해 볼 수 있습니다. 환자의 전신상태나 수술에 따른 합병증 발생 위험성이 높은 경우, 전신항암화학요법과 방사선 치료가 있으나 이는 수술을 대체하는 표준 치료가 아니므로 예후가 불량할 수 있습니다.`,
  
  withoutSurgery: `적절한 시기에 수술이 진행되지 않을 경우, 암세포로 이루어진 병변의 크기가 증가하고 직접 또는 혈액이나 림프관을 통한 전이 병변이 늘어남으로써, 삶의 질이 떨어지고 사망에 이르게 될 것입니다.`,
  
  surgeryMethod: `수술은 수술 전 검사 소견과 환자의 내과적 상태와 과거력을 고려하여 개복, 복강경 혹은 로봇 수술 중에서 시행됩니다. 복강경이나 로봇 수술로 병변을 안전하고 완벽하게 제거하는 것이 어렵다고 판단되는 경우에 개복 수술로 진행하거나 변경될 수 있습니다.`,
  
  surgeryScope: `초기 자궁내막암에서는 표준 치료로 골반세척세포검사, 자궁절제술과 양측 난관난소절제술을 시행합니다. 수술 전 검사나 수술 중 육안 소견에 따라 골반과 대동맥주위 림프절절제술을 시행할 수 있습니다.`,
  
  surgeryTime: `수술 시간은 수술 범위, 수술실 내 추가 검사, 환자 상태에 따라 차이가 있으나 일반적으로 피부 절개에서 봉합까지 약 2-4시간 정도가 소요됩니다. 병실로 다시 돌아가기까지는 약 6시간 이상이 소요됩니다.`,
  
  complications: `주변 장기 손상, 출혈, 운동 및 감각 기능 저하, 수술 부위 통증, 혈전색전증, 하지부종 및 림프낭종, 장폐색, 수술 창상 및 기타 감염, 배뇨장애, 주변 장기와의 누공, 장시간 수술에 따른 합병증 등이 발생할 수 있습니다.`,
  
  postSurgeryCare: `수술 직후 숨을 크게 들이 마시고 내쉬는 연습을 통해 무기폐로 인한 발열을 줄일 수 있습니다. 가능한 한 빨리, 많이 걸어야 수술로 인한 장 마비 발생을 줄일 수 있습니다. 수술 후 약 6주간은 골반 내 압력이 많이 올라갈 수 있는 활동이나 운동은 피해야 합니다.`,
  
  discharge: `수술 후 퇴원은 환자 상태에 따라 차이가 있으나 대개 1-2주 이내에 하게 됩니다. 수술 후 보조 치료를 시행해야 하는 경우나 조직병리검사 결과를 확인하고 퇴원해야 하는 경우에는 퇴원 일정이 변경될 수도 있습니다.`
};

// 수술 설명 주제 목록
const SURGERY_TOPICS = [
  { 
    id: "diagnosis", 
    label: "진단명 및 수술의 필요성", 
    explanation: "현재 진단된 질환에 대해 수술적 치료가 가장 효과적인 방법으로 권고됩니다. 수술을 통해 증상 완화와 질환의 진행을 막을 수 있으며, 수술을 하지 않을 경우 증상이 악화되거나 합병증이 발생할 수 있습니다."
  },
  { 
    id: "procedure", 
    label: "수술 방법 및 과정", 
    explanation: "수술은 담당 의료진이 환자의 상태에 맞는 최적의 방법으로 진행됩니다. 수술 중 예상치 못한 상황이 발생할 경우, 환자의 안전을 위해 수술 방법이 변경될 수 있습니다. 수술 시간은 환자 상태와 수술 범위에 따라 달라질 수 있습니다."
  },
  { 
    id: "anesthesia", 
    label: "마취 방법 및 주의사항", 
    explanation: "수술에 적합한 마취 방법(전신마취, 부분마취, 국소마취 등)이 적용됩니다. 마취 전 8시간 이상 금식이 필요하며, 마취 후 일시적인 두통, 오심, 구토 등이 발생할 수 있습니다. 마취 관련 상세 설명은 마취과 전문의와 별도 상담이 진행됩니다."
  },
  { 
    id: "risks", 
    label: "수술의 위험성 및 합병증", 
    explanation: "모든 수술에는 일반적인 위험(출혈, 감염, 혈전, 마취 합병증 등)이 있습니다. 또한 수술 부위에 따른 특이 합병증(신경 손상, 장기 손상, 유착 등)이 발생할 수 있습니다. 드물지만 예기치 못한 합병증으로 재수술이 필요할 수 있으며, 극히 드문 경우 생명에 위험이 있을 수 있습니다."
  },
  { 
    id: "recovery", 
    label: "수술 후 회복 과정", 
    explanation: "수술 후 입원 기간은 수술 종류와 회복 상태에 따라 결정됩니다. 퇴원 후에도 정기적인 외래 방문이 필요하며, 의료진의 지시에 따라 활동 제한, 식이 조절, 약물 복용 등을 준수해야 합니다. 완전한 회복까지 수 주에서 수 개월이 소요될 수 있습니다."
  },
  { 
    id: "alternatives", 
    label: "대체 치료법", 
    explanation: "수술 외에 약물 치료, 물리 치료, 시술 등의 대체 치료 방법이 있을 수 있습니다. 각 치료법의 장단점과 예상 결과가 다르며, 담당 의료진과 상담을 통해 가장 적합한 치료 방법을 선택하실 수 있습니다. 다만 현재 상태에서는 수술이 권고되는 이유가 있습니다."
  },
  { 
    id: "blood", 
    label: "수혈 및 혈액제제 사용", 
    explanation: "수술 중 출혈량에 따라 수혈이 필요할 수 있습니다. 수혈에는 알레르기 반응, 감염 등의 위험이 있으나 국내 혈액은 엄격한 검사를 거쳐 안전하게 관리됩니다. 종교적 또는 개인적 사유로 수혈을 원치 않으시면 사전에 의료진에게 말씀해 주세요."
  },
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
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 자막 데이터 (시간, 텍스트)
  // 설명 챕터 정의
  const chapters = [
    { id: 1, title: "인사 및 안내", start: 0, end: 17.588 },
    { id: 2, title: "수술 목적", start: 17.588, end: 51.272 },
    { id: 3, title: "수술 방법", start: 51.272, end: 72.728 },
  ];

  const subtitles = [
    { start: 0, end: 2.572, text: "안녕하십니까" },
    { start: 2.572, end: 7.452, text: "귀하께서 받으실 자궁 내막암 수술에 대해 설명드리겠습니다." },
    { start: 7.452, end: 17.588, text: "이 대화는 수술 전 충분한 이해를 돕기 위해 진행하는 것이며, 설명을 들은 후 궁금하신 점은 담당 의료진에게 언제든 문의하실 수 있습니다." },
    { start: 17.588, end: 24.208, text: "지금부터 수술의 목적, 방법, 위험성, 그리고 주의사항을 차례로 설명드리겠습니다." },
    { start: 24.208, end: 27.696, text: "먼저 수술의 목적에 대해 말씀드리겠습니다." },
    { start: 27.696, end: 32.720, text: "자궁 안쪽에 암세포가 생기는 것을 자궁내막암이라고 부릅니다." },
    { start: 32.720, end: 38.044, text: "이 병을 치료하는 방법은 수술로 암이 있는 부분을 제거하는 것입니다." },
    { start: 38.044, end: 43.824, text: "초기 암인 경우에는 자궁, 양쪽 난소, 양쪽 난팔관을 떼어냅니다." },
    { start: 43.824, end: 51.272, text: "수술 후에는 떼어낸 조직을 자세히 검사해서, 앞으로 어떤 추가 치료가 필요한지 결정하게 됩니다." },
    { start: 51.272, end: 55.192, text: "그럼 3가지 수술방법에 대해 말씀 드리겠습니다." },
    { start: 55.192, end: 61.380, text: "첫 번째는 개복 수술로 자궁에 직접 접근하여 수술합니다." },
    { start: 61.380, end: 67.432, text: "두 번째는 복강경 수술로 아랫배에 5개의 작은 구멍을 뚫어 진행합니다." },
    { start: 67.432, end: 72.728, text: "세 번째는 로봇을 이용한 수술로 정밀도가 매우 높은 수술입니다." },
  ];

  // 현재 챕터 추적
  const [currentChapter, setCurrentChapter] = useState(1);

  // Consultation form state
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultDate, setConsultDate] = useState("");
  const [consultTime, setConsultTime] = useState("");
  const [consultReason, setConsultReason] = useState("");
  
  // Understanding check state
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // AI Voice Chat state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPhase("intro");
      setIsPlaying(false);
      setVideoEnded(false);
      setCurrentSubtitle("");
      setSubtitleIndex(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      setSelectedTopics([]);
    }
    return () => {
      if (subtitleTimerRef.current) {
        clearInterval(subtitleTimerRef.current);
      }
    };
  }, [open]);

  // 자막 및 챕터 업데이트
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      subtitleTimerRef.current = setInterval(() => {
        const currentTime = videoRef.current?.currentTime || 0;
        const subtitle = subtitles.find(
          (s) => currentTime >= s.start && currentTime < s.end
        );
        setCurrentSubtitle(subtitle?.text || "");
        
        // 현재 챕터 업데이트
        const chapter = chapters.find(
          (c) => currentTime >= c.start && currentTime < c.end
        );
        if (chapter) {
          setCurrentChapter(chapter.id);
        }
      }, 100);
    } else {
      if (subtitleTimerRef.current) {
        clearInterval(subtitleTimerRef.current);
      }
      if (!isPlaying) {
        setCurrentSubtitle("");
      }
    }
    return () => {
      if (subtitleTimerRef.current) {
        clearInterval(subtitleTimerRef.current);
      }
    };
  }, [isPlaying]);

  const handleStartIntro = () => {
    setPhase("video");
    // Use setTimeout to ensure the fullscreen dialog renders first
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsPlaying(true);
        // 첫 번째 자막 즉시 표시
        const firstSubtitle = subtitles.find(s => 0 >= s.start && 0 < s.end);
        setCurrentSubtitle(firstSubtitle?.text || "");
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
      setPhase("consultation-confirm");
    }
  };

  const handleConsultationConfirm = (requestConsultation: boolean) => {
    if (requestConsultation) {
      setPhase("consultation");
    } else {
      // AI 음성 상담 시작
      setPhase("ai-voice-chat");
      setChatMessages([{
        role: 'ai',
        content: '안녕하세요. 수술에 관해 궁금하신 점을 말씀해 주세요. 수술 목적, 방법, 위험성, 회복 과정 등 무엇이든 질문하실 수 있습니다.'
      }]);
      // 시뮬레이션: AI가 처음 인사를 말함
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    // 시뮬레이션: 음성 인식 중
    setTimeout(() => {
      setIsListening(false);
      const userQuestion = "수술 후 회복 기간은 얼마나 걸리나요?";
      setChatMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
      
      // AI 응답 생성
      setTimeout(() => {
        setIsSpeaking(true);
        const aiResponse = SURGERY_KNOWLEDGE_BASE.postSurgeryCare + " " + SURGERY_KNOWLEDGE_BASE.discharge;
        setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
        setTimeout(() => setIsSpeaking(false), 5000);
      }, 1000);
    }, 3000);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleAiChatComplete = () => {
    setPhase("understanding-confirm");
    setChatMessages([]);
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
                
                {/* 자막 표시 */}
                <div className={`absolute bottom-8 left-0 right-0 flex justify-center px-4 transition-opacity duration-500 ease-in-out ${
                  currentSubtitle ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="bg-black/80 text-white px-6 py-3 rounded-lg text-center max-w-[90%]">
                    <p className="text-base md:text-lg font-medium leading-relaxed">
                      {currentSubtitle || '\u00A0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 챕터 진행 표시 */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-3 text-center">설명 진행 상황</p>
                <div className="flex items-center justify-center gap-2">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                            currentChapter === chapter.id
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110"
                              : currentChapter > chapter.id
                              ? "bg-primary/80 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {chapter.id}
                        </div>
                        <span
                          className={`text-xs mt-1.5 max-w-[80px] text-center transition-colors duration-300 ${
                            currentChapter === chapter.id
                              ? "text-primary font-semibold"
                              : currentChapter > chapter.id
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {chapter.title}
                        </span>
                      </div>
                      {index < chapters.length - 1 && (
                        <div
                          className={`w-8 h-0.5 mx-1 mt-[-16px] transition-colors duration-300 ${
                            currentChapter > chapter.id ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 이전/다음 버튼 */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (videoRef.current && currentChapter > 1) {
                      const prevChapter = chapters.find(c => c.id === currentChapter - 1);
                      if (prevChapter) {
                        videoRef.current.currentTime = prevChapter.start;
                        setCurrentChapter(prevChapter.id);
                        if (!isPlaying) {
                          videoRef.current.play();
                          setIsPlaying(true);
                        }
                      }
                    }
                  }}
                  disabled={currentChapter <= 1}
                  className="px-6"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  이전
                </Button>
                
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        videoRef.current.play();
                        setIsPlaying(true);
                      }
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {isPlaying ? "질문하기" : "대화 질문 완료"}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (videoRef.current && currentChapter < chapters.length) {
                      const nextChapter = chapters.find(c => c.id === currentChapter + 1);
                      if (nextChapter) {
                        videoRef.current.currentTime = nextChapter.start;
                        setCurrentChapter(nextChapter.id);
                        if (!isPlaying) {
                          videoRef.current.play();
                          setIsPlaying(true);
                        }
                      }
                    }
                  }}
                  disabled={currentChapter >= chapters.length}
                  className="px-6"
                >
                  다음
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
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
                  이해하지 못함
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

        {/* Consultation Confirm Phase - Ask if want consultation or AI chat */}
        {phase === "consultation-confirm" && (
          <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-lg mx-auto w-full">
            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center mb-8">
              <UserRound className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">
                의료진과 면담을 진행하시겠습니까?
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                의료진과 직접 면담을 신청하시거나,<br />
                AI 음성 상담을 통해 추가 설명을 들으실 수 있습니다.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="hero"
                size="lg"
                className="w-full text-base py-6"
                onClick={() => handleConsultationConfirm(true)}
              >
                <UserRound className="w-5 h-5 mr-3" />
                의료진 면담 신청
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full text-base py-6"
                onClick={() => handleConsultationConfirm(false)}
              >
                <Headphones className="w-5 h-5 mr-3" />
                AI 음성 상담으로 추가 설명 듣기
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="w-full text-base py-6"
                onClick={() => setPhase("understanding-confirm")}
              >
                뒤로
              </Button>
            </div>
          </div>
        )}

        {/* AI Voice Chat Phase */}
        {phase === "ai-voice-chat" && (
          <div className="flex-1 flex flex-col px-6 py-8 max-w-lg mx-auto w-full">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-center mb-4">
              <Headphones className="w-10 h-10 text-primary mx-auto mb-2" />
              <h2 className="text-lg font-bold mb-1">
                AI 음성 상담
              </h2>
              <p className="text-xs text-muted-foreground">
                수술에 관해 궁금하신 점을 말씀해 주세요
              </p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-auto space-y-3 mb-4 bg-muted/30 rounded-xl p-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card border border-border rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isSpeaking && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md p-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground">AI가 설명 중...</span>
                  </div>
                </div>
              )}
              {isListening && (
                <div className="flex justify-end">
                  <div className="bg-primary/10 border border-primary/30 rounded-2xl rounded-br-md p-3 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm text-primary">듣고 있습니다...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Control */}
            <div className="space-y-3">
              <div className="flex justify-center">
                <button
                  onClick={isListening ? handleStopListening : handleStartListening}
                  disabled={isSpeaking}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-destructive text-destructive-foreground animate-pulse'
                      : isSpeaking
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {isListening ? '말씀을 멈추시려면 버튼을 누르세요' : isSpeaking ? 'AI가 설명 중입니다' : '버튼을 누르고 말씀해 주세요'}
              </p>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPhase("consultation-confirm")}
                >
                  뒤로
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleAiChatComplete}
                >
                  상담 완료
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
                onClick={() => setPhase("consultation-confirm")}
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
