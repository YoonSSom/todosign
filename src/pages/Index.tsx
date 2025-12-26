import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import FAQSection from "@/components/FAQSection";
import { usePresentationNav } from "@/components/PresentationNav";

const Index = () => {
  const { setCurrentStepId } = usePresentationNav();

  useEffect(() => {
    setCurrentStepId("home");
  }, [setCurrentStepId]);
  return (
    <>
      <Helmet>
        <title>비대면 수술 동의서 전자서명 서비스 | 아산병원</title>
        <meta 
          name="description" 
          content="아산병원 비대면 수술 동의서 전자서명 서비스입니다. 병원을 방문하지 않고도 안전하게 수술 동의서를 작성하고 전자서명을 완료할 수 있습니다." 
        />
      </Helmet>
      <HeroSection />
      <FAQSection />
    </>
  );
};

export default Index;
