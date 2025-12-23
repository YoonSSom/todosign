import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Video, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "안전한 본인확인",
      description: "실시간 얼굴 인식으로 환자 본인 확인",
    },
    {
      icon: Video,
      title: "AI 아바타 설명",
      description: "수술 내용을 쉽게 이해할 수 있는 영상 제공",
    },
    {
      icon: FileCheck,
      title: "전자서명 동의",
      description: "법적 효력이 있는 전자서명 시스템",
    },
    {
      icon: MapPin,
      title: "병원 길 안내",
      description: "완료 후 아산병원 길 안내 제공",
    },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="w-full py-4 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">아산병원</h1>
              <p className="text-xs text-muted-foreground">ASAN MEDICAL CENTER</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:block">비대면 수술 동의 서비스</span>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Shield className="w-4 h-4" />
                안전하고 신뢰할 수 있는 서비스
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                비대면 수술 동의서
                <span className="block text-gradient">전자서명 서비스</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                병원을 방문하지 않고도 안전하게 수술 동의서를 작성하고 
                전자서명을 완료할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate("/surgery-consent")}
                className="w-full sm:w-auto"
              >
                수술 동의서 작성하기
              </Button>
              <Button 
                variant="medical-outline" 
                size="xl"
                className="w-full sm:w-auto"
              >
                서비스 안내
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground">법적 효력 보장</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-xs text-muted-foreground">언제든 작성 가능</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">5분</p>
                <p className="text-xs text-muted-foreground">평균 소요 시간</p>
              </div>
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-button flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default HeroSection;
