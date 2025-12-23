import { useState } from "react";
import { Helmet } from "react-helmet-async";
import IdentityVerification from "@/components/surgery/IdentityVerification";
import SurgeryInfoDialog from "@/components/surgery/SurgeryInfoDialog";
import FaceRecognitionDialog from "@/components/surgery/FaceRecognitionDialog";
import AvatarVoiceChatDialog from "@/components/surgery/AvatarVoiceChatDialog";
import SurgeryOrderGame from "@/components/surgery/SurgeryOrderGame";
import ConsentForm from "@/components/surgery/ConsentForm";
import CompletePage from "@/components/surgery/CompletePage";
import ProgressIndicator from "@/components/surgery/ProgressIndicator";

export interface PatientInfo {
  name: string;
  birthDate: Date | null;
  phone: string;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
}


type Step = "identity" | "consent-form" | "complete";

const SurgeryConsent = () => {
  const [currentStep, setCurrentStep] = useState<Step>("identity");
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [patientSignature, setPatientSignature] = useState<string | undefined>();
  const [guardianSignature, setGuardianSignature] = useState<string | undefined>();

  // Dialog states
  const [showSurgeryInfoDialog, setShowSurgeryInfoDialog] = useState(false);
  const [showFaceRecognitionDialog, setShowFaceRecognitionDialog] = useState(false);
  const [showAvatarVoiceChatDialog, setShowAvatarVoiceChatDialog] = useState(false);
  const [showGameDialog, setShowGameDialog] = useState(false);

  const handleIdentityVerified = (info: PatientInfo) => {
    setPatientInfo(info);
    setShowSurgeryInfoDialog(true);
  };

  const handleSurgeryInfoConfirmed = () => {
    setShowSurgeryInfoDialog(false);
    setShowFaceRecognitionDialog(true);
  };

  const handleFaceRecognitionComplete = () => {
    setShowFaceRecognitionDialog(false);
    setShowAvatarVoiceChatDialog(true);
  };

  const handleAvatarVideoComplete = () => {
    setShowAvatarVoiceChatDialog(false);
    setShowGameDialog(true);
  };

  const handleGameComplete = () => {
    setShowGameDialog(false);
    setCurrentStep("consent-form");
  };

  const handleConsentComplete = (patientSig?: string, guardianSig?: string) => {
    setPatientSignature(patientSig);
    setGuardianSignature(guardianSig);
    setCurrentStep("complete");
  };

  // Calculate progress percentage for game-like progress bar
  const getProgressPercentage = () => {
    if (currentStep === "identity") return 0;
    if (currentStep === "consent-form") return 50;
    return 100;
  };

  return (
    <>
      <Helmet>
        <title>수술 동의서 작성 | 아산병원</title>
        <meta name="description" content="아산병원 비대면 수술 동의서 작성 페이지입니다." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Game-style Header */}
        <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <span className="font-bold text-white">아산병원</span>
                <p className="text-xs text-purple-300">수술 동의서 퀘스트</p>
              </div>
            </div>
            
            {/* XP/Level indicator */}
            {currentStep !== "complete" && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <span className="text-yellow-400 text-sm font-bold">⭐</span>
                  <span className="text-yellow-300 text-sm font-medium">Level 1</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Game Progress Bar */}
        {currentStep !== "complete" && (
          <div className="container pt-6">
            <ProgressIndicator currentStep={currentStep} />
            
            {/* XP Bar */}
            <div className="max-w-2xl mx-auto mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-300 font-medium">진행률</span>
                <span className="text-sm text-purple-300 font-bold">{getProgressPercentage()}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 transition-all duration-1000 ease-out relative"
                  style={{ width: `${getProgressPercentage()}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="container py-8 relative z-10">
          {currentStep === "identity" && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                  <span className="text-purple-300 text-sm font-medium">🎮 미션 1</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">본인 확인 미션</h2>
                <p className="text-purple-300">신원을 확인하고 다음 단계로 진행하세요!</p>
              </div>
              <IdentityVerification onVerified={handleIdentityVerified} />
            </div>
          )}

          {currentStep === "consent-form" && patientInfo && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                  <span className="text-green-300 text-sm font-medium">🎮 미션 2</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">동의서 작성 미션</h2>
                <p className="text-green-300">동의서를 완성하고 최종 목표를 달성하세요!</p>
              </div>
              <ConsentForm 
                patientInfo={patientInfo} 
                onComplete={handleConsentComplete} 
              />
            </div>
          )}

          {currentStep === "complete" && patientInfo && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4 animate-bounce">
                  <span className="text-yellow-300 text-sm font-medium">🏆 퀘스트 완료!</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">축하합니다!</h2>
                <p className="text-yellow-300">모든 미션을 성공적으로 완료했습니다!</p>
              </div>
              <CompletePage 
                patientInfo={patientInfo} 
                patientSignature={patientSignature}
                guardianSignature={guardianSignature}
              />
            </div>
          )}
        </main>

        {/* Dialogs */}
        {patientInfo && (
          <>
            <SurgeryInfoDialog
              open={showSurgeryInfoDialog}
              onOpenChange={setShowSurgeryInfoDialog}
              patientInfo={patientInfo}
              onConfirm={handleSurgeryInfoConfirmed}
            />

            <FaceRecognitionDialog
              open={showFaceRecognitionDialog}
              onOpenChange={setShowFaceRecognitionDialog}
              onComplete={handleFaceRecognitionComplete}
            />

            <AvatarVoiceChatDialog
              open={showAvatarVoiceChatDialog}
              onOpenChange={setShowAvatarVoiceChatDialog}
              patientName={patientInfo.name}
              onComplete={handleAvatarVideoComplete}
            />

            <SurgeryOrderGame
              open={showGameDialog}
              onOpenChange={setShowGameDialog}
              onComplete={handleGameComplete}
            />
          </>
        )}
      </div>
    </>
  );
};

export default SurgeryConsent;
