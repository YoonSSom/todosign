import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePresentationNav } from "@/components/PresentationNav";
import { ChevronDown, HelpCircle } from "lucide-react";
import asanLogo from "@/assets/asan-logo.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const faqs = [
  {
    question: "전자서명의 법적 효력은 어떻게 되나요?",
    answer:
      "전자서명법에 따라 전자서명은 서면 서명과 동일한 법적 효력을 가집니다. 본 서비스는 공인된 본인인증 절차를 거쳐 안전하게 서명을 진행합니다.",
  },
  {
    question: "본인인증은 어떤 방식으로 진행되나요?",
    answer:
      "휴대폰 본인인증과 얼굴 인식을 통한 본인확인 절차를 진행합니다. 환자 본인만이 서명할 수 있도록 철저한 인증 시스템을 갖추고 있습니다.",
  },
  {
    question: "서명 후 동의서를 다시 확인할 수 있나요?",
    answer:
      "네, 서명 완료 후 동의서 사본을 출력하거나 PDF로 저장할 수 있습니다. 또한 병원 방문 시에도 언제든지 확인 가능합니다.",
  },
  {
    question: "미성년자의 경우 어떻게 서명하나요?",
    answer:
      "미성년자의 경우 법정대리인(보호자)의 동의가 필요합니다. 환자 본인과 보호자 모두의 서명이 진행되며, 보호자의 본인인증도 함께 진행됩니다.",
  },
  {
    question: "수술 내용에 대해 추가 설명이 필요하면 어떻게 하나요?",
    answer:
      "AI 음성 상담을 통해 수술 관련 질문에 대한 답변을 받으실 수 있습니다. 더 자세한 상담이 필요한 경우 의료진 면담을 신청하실 수 있습니다.",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const { setCurrentStepId } = usePresentationNav();
  const [faqOpen, setFaqOpen] = useState(false);

  const handleStartConsent = () => {
    setCurrentStepId("identity");
    navigate("/surgery-consent");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12 animate-fade-up">
          <img src={asanLogo} alt="서울아산병원 로고" className="h-14 w-auto" />
        </div>

        {/* Title Section */}
        <div className="text-center space-y-4 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            비대면 수술 동의서
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-gradient">전자서명</span>
            <span className="text-foreground"> 서비스</span>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground text-center text-lg mb-12 animate-fade-up" style={{ animationDelay: '200ms' }}>
          안전하고 신뢰할 수 있는 비대면 수술 동의서 서명 서비스
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <Button 
            variant="hero" 
            size="xl"
            onClick={handleStartConsent}
            className="px-12 py-6 text-lg"
          >
            수술 동의서 작성하기
          </Button>
          
          <Collapsible open={faqOpen} onOpenChange={setFaqOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="xl"
                className="px-8 py-6 text-lg border-primary/30 hover:bg-primary/5"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                자주 묻는 질문
                <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-300 ${faqOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* FAQ Section */}
        <Collapsible open={faqOpen} onOpenChange={setFaqOpen}>
          <CollapsibleContent className="mt-8 w-full max-w-2xl animate-fade-up">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-6 space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border-b border-border/30 last:border-0 pb-4 last:pb-0"
                >
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default HeroSection;
