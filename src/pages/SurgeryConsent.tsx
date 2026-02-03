import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import IdentityVerification from "@/components/surgery/IdentityVerification";
import SurgeryInfoDialog from "@/components/surgery/SurgeryInfoDialog";
import FaceRecognitionDialog from "@/components/surgery/FaceRecognitionDialog";
import AvatarVoiceChatDialog from "@/components/surgery/AvatarVoiceChatDialog";
import SurgeryOrderGame from "@/components/surgery/SurgeryOrderGame";
import ConsentForm from "@/components/surgery/ConsentForm";
import CompletePage from "@/components/surgery/CompletePage";
import ProgressIndicator from "@/components/surgery/ProgressIndicator";
import ResumeProgressDialog from "@/components/surgery/ResumeProgressDialog";
import SurgeryConsentChatbot from "@/components/surgery/SurgeryConsentChatbot";

// Session and Progress utilities
import { 
  saveSessionToken, 
  getSessionToken, 
  clearSessionToken 
} from "@/lib/sessionStorage";
import { 
  saveProgress, 
  getProgress, 
  clearProgress, 
  updateProgressStep,
  convertToPageStep,
  type ProgressData,
  type ConsentStep 
} from "@/lib/progressStorage";

export interface PatientInfo {
  name: string;
  birthDate: Date | null;
  phone: string;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
  receptionNumber?: string;
  patientId?: string; // 서버에서 반환하는 고유 ID
}

type Step = "identity" | "explanation" | "consent-form" | "complete";

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
  
  // Resume progress dialog
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedProgress, setSavedProgress] = useState<ProgressData | null>(null);
  const [pendingPatientInfo, setPendingPatientInfo] = useState<PatientInfo | null>(null);

  // 현재 활성화된 ConsentStep 추적
  const [activeConsentStep, setActiveConsentStep] = useState<ConsentStep>('identity');

  // 초기 세션 확인
  useEffect(() => {
    const session = getSessionToken();
    if (session) {
      console.log('Existing session found:', session.patientId);
    }
  }, []);

  // 자동 저장 간격 (30초)
  const AUTO_SAVE_INTERVAL = 30000;

  // 자동 저장 기능
  useEffect(() => {
    if (!patientInfo?.patientId || currentStep === 'complete' || currentStep === 'identity') {
      return;
    }

    // 자동 저장 함수
    const autoSave = () => {
      if (patientInfo?.patientId && activeConsentStep !== 'identity' && activeConsentStep !== 'complete') {
        updateProgressStep(patientInfo.patientId, activeConsentStep);
        console.log('Auto-saved progress:', activeConsentStep);
      }
    };

    // 일정 간격으로 자동 저장
    const intervalId = setInterval(autoSave, AUTO_SAVE_INTERVAL);

    // 페이지 언로드 시 저장
    const handleBeforeUnload = () => {
      if (patientInfo?.patientId && activeConsentStep !== 'identity' && activeConsentStep !== 'complete') {
        updateProgressStep(patientInfo.patientId, activeConsentStep);
      }
    };

    // visibility 변경 시 저장 (탭 전환, 앱 백그라운드 등)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        autoSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [patientInfo?.patientId, activeConsentStep, currentStep]);

  // 진행 상태 저장 함수
  const saveCurrentProgress = useCallback((step: ConsentStep, surgeryInfo?: ProgressData['surgeryInfo']) => {
    if (patientInfo?.patientId) {
      updateProgressStep(patientInfo.patientId, step, surgeryInfo);
    }
  }, [patientInfo?.patientId]);

  // 저장된 단계로 이동
  const navigateToStep = useCallback((step: ConsentStep, info: PatientInfo) => {
    setPatientInfo(info);
    
    const pageStep = convertToPageStep(step);
    setCurrentStep(pageStep);
    
    // 다이얼로그 상태 설정
    setShowSurgeryInfoDialog(step === 'surgery-info');
    setShowFaceRecognitionDialog(step === 'face-recognition');
    setShowAvatarVoiceChatDialog(step === 'avatar-explanation');
    setShowGameDialog(step === 'game');
  }, []);

  const handleIdentityVerified = (info: PatientInfo) => {
    // 환자 ID 생성 (실제 서버에서는 서버가 반환)
    // 개인정보 인증: 이름 + 생년월일 + 전화번호 조합
    // 접수번호 인증: 접수번호
    const patientId = info.receptionNumber 
      ? `RN-${info.receptionNumber}` 
      : `PI-${info.name}-${info.birthDate?.getTime() || ''}-${info.phone}`;
    
    const infoWithId: PatientInfo = { ...info, patientId };
    
    // 세션 토큰 저장
    saveSessionToken(patientId);
    
    // 저장된 진행 상태 확인
    const existingProgress = getProgress(patientId);
    
    if (existingProgress && existingProgress.currentStep !== 'identity') {
      // 저장된 진행 상태가 있으면 팝업 표시
      setSavedProgress(existingProgress);
      setPendingPatientInfo(infoWithId);
      setShowResumeDialog(true);
    } else {
      // 저장된 진행 상태가 없으면 처음부터 시작
      proceedAfterVerification(infoWithId, false);
    }
  };

  const proceedAfterVerification = (info: PatientInfo, isResume: boolean, resumeStep?: ConsentStep) => {
    setPatientInfo(info);
    
    if (isResume && resumeStep) {
      navigateToStep(resumeStep, info);
    } else {
      // 새로 시작
      setCurrentStep("explanation");
      setShowSurgeryInfoDialog(true);
      
      // 진행 상태 저장
      if (info.patientId) {
        saveProgress({
          patientId: info.patientId,
          currentStep: 'surgery-info',
          timestamp: Date.now(),
        });
      }
    }
  };

  const handleResumeProgress = () => {
    if (pendingPatientInfo && savedProgress) {
      proceedAfterVerification(pendingPatientInfo, true, savedProgress.currentStep);
    }
    setShowResumeDialog(false);
    setSavedProgress(null);
    setPendingPatientInfo(null);
  };

  const handleStartFresh = () => {
    if (pendingPatientInfo) {
      // 진행 상태 초기화
      clearProgress();
      proceedAfterVerification(pendingPatientInfo, false);
    }
    setShowResumeDialog(false);
    setSavedProgress(null);
    setPendingPatientInfo(null);
  };

  const handleSurgeryInfoConfirmed = () => {
    setShowSurgeryInfoDialog(false);
    setShowFaceRecognitionDialog(true);
    setActiveConsentStep('face-recognition');
    saveCurrentProgress('face-recognition');
  };

  const handleFaceRecognitionComplete = () => {
    setShowFaceRecognitionDialog(false);
    setShowAvatarVoiceChatDialog(true);
    setActiveConsentStep('avatar-explanation');
    saveCurrentProgress('avatar-explanation');
  };

  const handleAvatarVideoComplete = () => {
    setShowAvatarVoiceChatDialog(false);
    setShowGameDialog(true);
    setActiveConsentStep('game');
    saveCurrentProgress('game');
  };

  const handleGameComplete = () => {
    setShowGameDialog(false);
    setCurrentStep("consent-form");
    setActiveConsentStep('consent-form');
    saveCurrentProgress('consent-form');
  };

  const handleConsentComplete = (patientSig?: string, guardianSig?: string) => {
    setPatientSignature(patientSig);
    setGuardianSignature(guardianSig);
    setCurrentStep("complete");
    setActiveConsentStep('complete');
    
    // 완료 시 진행 상태 및 세션 정리
    clearProgress();
    clearSessionToken();
  };


  return (
    <>
      <Helmet>
        <title>수술 동의서 작성 | 아산병원</title>
        <meta name="description" content="아산병원 비대면 수술 동의서 작성 페이지입니다." />
      </Helmet>

      <div className="min-h-screen bg-background">

        <main className="container py-8">
          {currentStep !== "complete" && (
            <ProgressIndicator currentStep={currentStep === "consent-form" ? "consent-form" : currentStep === "explanation" ? "explanation" : "identity"} />
          )}

          {currentStep === "identity" && (
            <IdentityVerification onVerified={handleIdentityVerified} />
          )}

          {currentStep === "consent-form" && patientInfo && (
            <ConsentForm 
              patientInfo={patientInfo} 
              onComplete={handleConsentComplete} 
            />
          )}

          {currentStep === "complete" && patientInfo && (
            <CompletePage 
              patientInfo={patientInfo} 
              patientSignature={patientSignature}
              guardianSignature={guardianSignature}
            />
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
              onBackToIntro={() => {
                // 아바타 선택 팝업(intro)으로 돌아가기 - 다이얼로그 내부에서 처리됨
              }}
            />

            <SurgeryOrderGame
              open={showGameDialog}
              onOpenChange={setShowGameDialog}
              onComplete={handleGameComplete}
            />
          </>
        )}

        {/* Resume Progress Dialog */}
        <ResumeProgressDialog
          open={showResumeDialog}
          onOpenChange={setShowResumeDialog}
          progressData={savedProgress}
          onResume={handleResumeProgress}
          onStartFresh={handleStartFresh}
        />

        {/* AI Chatbot */}
        <SurgeryConsentChatbot />
      </div>
    </>
  );
};

export default SurgeryConsent;