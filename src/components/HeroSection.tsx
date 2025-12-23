import { Button } from "@/components/ui/button";
import { FileCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">아산병원</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">서비스 안내</a>
          <a href="#" className="hover:text-foreground transition-colors">이용 방법</a>
          <a href="#" className="hover:text-foreground transition-colors">문의하기</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            <span className="block">비대면</span>
            <span className="block">수술동의서</span>
            <span className="block text-primary">전자서명</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mb-12 leading-relaxed">
            병원 방문 없이 안전하고 편리하게<br />
            수술 동의서를 작성하세요
          </p>

          <Button 
            onClick={() => navigate("/surgery-consent")}
            className="group h-14 px-8 text-base font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all"
          >
            동의서 작성하기
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          © 2025 아산병원. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">개인정보처리방침</a>
          <a href="#" className="hover:text-foreground transition-colors">이용약관</a>
          <a href="#" className="hover:text-foreground transition-colors">고객센터</a>
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;
