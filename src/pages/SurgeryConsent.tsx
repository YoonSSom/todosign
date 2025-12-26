import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import IdentityVerification from "@/components/surgery/IdentityVerification";
import SurgeryInfoDialog from "@/components/surgery/SurgeryInfoDialog";
import FaceRecognitionDialog from "@/components/surgery/FaceRecognitionDialog";
import AvatarVoiceChatDialog from "@/components/surgery/AvatarVoiceChatDialog";
import SurgeryOrderGame from "@/components/surgery/SurgeryOrderGame";
import ConsentForm from "@/components/surgery/ConsentForm";
import CompletePage from "@/components/surgery/CompletePage";
import ProgressIndicator from "@/components/surgery/ProgressIndicator";
import { usePresentationNav } from "@/components/PresentationNav";
import asanLogo from "@/assets/asan-logo.png";

export interface PatientInfo {
  name: string;
  birthDate: Date | null;
  phone: string;
  isMinor: boolean;
  guardianName?: string;
  guardianPhone?: string;
  receptionNumber?: string;
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

  const { currentStepId, setCurrentStepId } = usePresentationNav();

  // Sync presentation nav with current step
  useEffect(() => {
    if (currentStepId === "identity" && currentStep !== "identity") {
      setCurrentStep("identity");
      setShowSurgeryInfoDialog(false);
      setShowFaceRecognitionDialog(false);
      setShowAvatarVoiceChatDialog(false);
      setShowGameDialog(false);
    } else if (currentStepId === "surgery-info") {
      if (!patientInfo) {
        setPatientInfo({ name: "홍길동", birthDate: new Date("1990-01-01"), phone: "010-1234-5678", isMinor: false });
      }
      setCurrentStep("explanation");
      setShowSurgeryInfoDialog(true);
      setShowFaceRecognitionDialog(false);
      setShowAvatarVoiceChatDialog(false);
      setShowGameDialog(false);
    } else if (currentStepId === "face-recognition") {
      if (!patientInfo) {
        setPatientInfo({ name: "홍길동", birthDate: new Date("1990-01-01"), phone: "010-1234-5678", isMinor: false });
      }
      setCurrentStep("explanation");
      setShowSurgeryInfoDialog(false);
      setShowFaceRecognitionDialog(true);
      setShowAvatarVoiceChatDialog(false);
      setShowGameDialog(false);
    } else if (currentStepId === "avatar-explanation") {
      if (!patientInfo) {
        setPatientInfo({ name: "홍길동", birthDate: new Date("1990-01-01"), phone: "010-1234-5678", isMinor: false });
      }
      setCurrentStep("explanation");
      setShowSurgeryInfoDialog(false);
      setShowFaceRecognitionDialog(false);
      setShowAvatarVoiceChatDialog(true);
      setShowGameDialog(false);
    } else if (currentStepId === "game") {
      if (!patientInfo) {
        setPatientInfo({ name: "홍길동", birthDate: new Date("1990-01-01"), phone: "010-1234-5678", isMinor: false });
      }
      setCurrentStep("explanation");
      setShowSurgeryInfoDialog(false);
      setShowFaceRecognitionDialog(false);
      setShowAvatarVoiceChatDialog(false);
      setShowGameDialog(true);
    } else if (currentStepId === "consent-form") {
      if (!patientInfo) {
        setPatientInfo({ name: "홍길동", birthDate: new Date("1990-01-01"), phone: "010-1234-5678", isMinor: false });
      }
      setCurrentStep("consent-form");
      setShowSurgeryInfoDialog(false);
      setShowFaceRecognitionDialog(false);
      setShowAvatarVoiceChatDialog(false);
      setShowGameDialog(false);
    } else if (currentStepId === "complete") {
      if (!patientInfo) {
        setPatientInfo({ name: "홍길동", birthDate: new Date("1990-01-01"), phone: "010-1234-5678", isMinor: false });
      }
      setCurrentStep("complete");
      setShowSurgeryInfoDialog(false);
      setShowFaceRecognitionDialog(false);
      setShowAvatarVoiceChatDialog(false);
      setShowGameDialog(false);
    }
  }, [currentStepId]);

  const handleIdentityVerified = (info: PatientInfo) => {
    setPatientInfo(info);
    setCurrentStep("explanation");
    setShowSurgeryInfoDialog(true);
    setCurrentStepId("surgery-info");
  };

  const handleSurgeryInfoConfirmed = () => {
    setShowSurgeryInfoDialog(false);
    setShowFaceRecognitionDialog(true);
    setCurrentStepId("face-recognition");
  };

  const handleFaceRecognitionComplete = () => {
    setShowFaceRecognitionDialog(false);
    setShowAvatarVoiceChatDialog(true);
    setCurrentStepId("avatar-explanation");
  };

  const handleAvatarVideoComplete = () => {
    setShowAvatarVoiceChatDialog(false);
    setShowGameDialog(true);
    setCurrentStepId("game");
  };

  const handleGameComplete = () => {
    setShowGameDialog(false);
    setCurrentStep("consent-form");
    setCurrentStepId("consent-form");
  };

  const handleConsentComplete = (patientSig?: string, guardianSig?: string) => {
    setPatientSignature(patientSig);
    setGuardianSignature(guardianSig);
    setCurrentStep("complete");
    setCurrentStepId("complete");
  };

  return (
    <>
      <Helmet>
        <title>수술 동의서 작성 | 아산병원</title>
        <meta name="description" content="아산병원 비대면 수술 동의서 작성 페이지입니다." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="flex items-center gap-3">
              <img src={asanLogo} alt="서울아산병원 로고" className="h-10 w-auto" />
            </div>
          </div>
        </header>

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
