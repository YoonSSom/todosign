import { Button } from "@/components/ui/button";
import { FileCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-background" />
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-foreground">
          <a href="#" className="hover:text-primary transition-colors">홈</a>
          <a href="#" className="hover:text-primary transition-colors">서비스</a>
          <a href="#" className="hover:text-primary transition-colors">소개</a>
          <a href="#" className="hover:text-primary transition-colors">문의</a>
        </nav>

        <Button 
          onClick={() => navigate("/surgery-consent")}
          className="h-11 px-6 rounded-lg bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
        >
          동의서 작성
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center">
        {/* Welcome Badge */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm font-medium text-muted-foreground tracking-wide">Welcome</span>
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal leading-tight max-w-3xl mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          비대면 수술 동의를 통한
          <br />
          <span className="italic">스마트한 의료 서비스</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
          병원을 방문하지 않고도 안전하게 수술 동의서를 작성하고
          <br className="hidden md:block" />
          전자서명을 완료할 수 있습니다.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button 
            onClick={() => navigate("/surgery-consent")}
            className="group h-12 px-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
          >
            동의서 작성하기
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline"
            className="h-12 px-8 rounded-lg border-foreground/20 text-foreground hover:bg-foreground/5 text-sm font-medium"
          >
            서비스 안내
          </Button>
        </div>

        {/* Trust Section */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-xs text-muted-foreground mb-6 tracking-wide">
            대한민국 주요 의료기관이 신뢰하는 서비스
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12 text-muted-foreground/60">
            <span className="text-sm font-semibold tracking-tight">아산병원</span>
            <span className="text-sm font-semibold tracking-tight">서울대병원</span>
            <span className="text-sm font-semibold tracking-tight hidden sm:block">삼성서울병원</span>
            <span className="text-sm font-semibold tracking-tight hidden md:block">세브란스</span>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute left-8 bottom-1/4 w-32 h-32 opacity-60 pointer-events-none hidden lg:block">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-orange-300/50 blur-sm transform rotate-12" />
      </div>
      <div className="absolute right-8 bottom-1/3 w-40 h-40 opacity-60 pointer-events-none hidden lg:block">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300/50 to-primary/30 blur-sm transform -rotate-12" />
      </div>
    </div>
  );
};

export default HeroSection;
