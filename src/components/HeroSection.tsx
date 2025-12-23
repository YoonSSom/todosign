import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100">
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
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
            <FileCheck className="w-7 h-7 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">아산병원</span>
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

        {/* CTA Button */}
        <Button 
          variant="hero" 
          size="xl"
          onClick={() => navigate("/surgery-consent")}
          className="px-12 py-6 text-lg animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          수술 동의서 작성하기
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default HeroSection;
